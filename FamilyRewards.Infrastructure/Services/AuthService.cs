using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using FamilyRewards.Core.DTOs.Auth;
using FamilyRewards.Core.Entities;
using FamilyRewards.Core.Enums;
using FamilyRewards.Core.Interfaces;
using FamilyRewards.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace FamilyRewards.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly IUnitOfWork _uow;
    private readonly IConfiguration _config;
    private readonly AppDbContext _context;

    public AuthService(IUnitOfWork uow, IConfiguration config, AppDbContext context)
    {
        _uow = uow;
        _config = config;
        _context = context;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        var existing = await _uow.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
        if (existing != null)
            throw new InvalidOperationException("Email already in use.");

        // Generate family code: fam0000001, fam0000002, etc.
        var familyCount = await _context.Families.CountAsync();
        var familyCode = $"fam{(familyCount + 1):D7}";

        var family = new Family { Name = dto.FamilyName, Code = familyCode };
        await _uow.Families.AddAsync(family);
        await _uow.SaveChangesAsync();

        var user = new User
        {
            FullName = dto.FullName,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = UserRole.Admin,
            FamilyId = family.Id
        };
        await _uow.Users.AddAsync(user);
        await _uow.SaveChangesAsync();

        return new AuthResponseDto
        {
            Token = GenerateToken(user),
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role.ToString(),
            UserId = user.Id,
            FamilyId = user.FamilyId,
            FamilyCode = familyCode,
            AvatarUrl = user.AvatarUrl
        };
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        // Support login by email (Admin) or login code (Child: fam0000001-01)
        var user = await _uow.Users.FirstOrDefaultAsync(u => u.Email == dto.LoginId);
        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid login ID or password.");

        // Get family code
        var family = await _uow.Families.GetByIdAsync(user.FamilyId);

        return new AuthResponseDto
        {
            Token = GenerateToken(user),
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role.ToString(),
            UserId = user.Id,
            FamilyId = user.FamilyId,
            FamilyCode = family?.Code ?? "",
            LoginCode = user.Role == UserRole.Child ? user.Email : null,
            AvatarUrl = user.AvatarUrl
        };
    }

    private string GenerateToken(User user)
    {
        var jwtSettings = _config.GetSection("JwtSettings");
        var key = Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]!);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.FullName),
            new Claim(ClaimTypes.Role, user.Role.ToString()),
            new Claim("familyId", user.FamilyId.ToString())
        };

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256)
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public async Task ForgotPasswordAsync(ForgotPasswordDto dto)
    {
        var user = await _uow.Users.FirstOrDefaultAsync(u => u.Email == dto.Email && u.Role == UserRole.Admin);
        if (user == null) return; // Silent return for security

        var token = Guid.NewGuid().ToString("N"); // generate simple mock token
        user.ResetToken = token;
        user.ResetTokenExpiry = DateTime.UtcNow.AddHours(1);

        _uow.Users.Update(user);
        await _uow.SaveChangesAsync();

        // MOCK EMAIL SENDING
        Console.WriteLine("\n===============================================");
        Console.WriteLine($"MOCK EMAIL SENT TO: {dto.Email}");
        Console.WriteLine($"SUBJECT: Reset Your Family Rewards Password");
        Console.WriteLine($"BODY: Use this token to reset your password: {token}");
        Console.WriteLine("===============================================\n");
    }

    public async Task ResetPasswordAsync(ResetPasswordWithTokenDto dto)
    {
        var user = await _uow.Users.FirstOrDefaultAsync(u => u.Email == dto.Email && u.ResetToken == dto.Token);
        if (user == null || user.ResetTokenExpiry == null || user.ResetTokenExpiry < DateTime.UtcNow)
        {
            throw new InvalidOperationException("Invalid or expired reset token.");
        }

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
        user.ResetToken = null;
        user.ResetTokenExpiry = null;

        _uow.Users.Update(user);
        await _uow.SaveChangesAsync();
    }
}
