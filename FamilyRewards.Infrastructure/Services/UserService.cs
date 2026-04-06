using FamilyRewards.Core.DTOs.User;
using FamilyRewards.Core.Entities;
using FamilyRewards.Core.Enums;
using FamilyRewards.Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using FamilyRewards.Infrastructure.Data;

namespace FamilyRewards.Infrastructure.Services;

public class UserService : IUserService
{
    private readonly IUnitOfWork _uow;
    private readonly AppDbContext _context;

    public UserService(IUnitOfWork uow, AppDbContext context)
    {
        _uow = uow;
        _context = context;
    }

    public async Task<UserDto> AddChildAsync(AddChildDto dto, int adminId)
    {
        var admin = await _uow.Users.GetByIdAsync(adminId)
            ?? throw new KeyNotFoundException("Admin not found.");

        // Get family code
        var family = await _uow.Families.GetByIdAsync(admin.FamilyId)
            ?? throw new KeyNotFoundException("Family not found.");

        // Calculate next child sequence
        var maxSeq = await _context.Users
            .Where(u => u.FamilyId == admin.FamilyId && u.ChildSequence != null)
            .MaxAsync(u => (int?)u.ChildSequence) ?? 0;
        var nextSeq = maxSeq + 1;

        // Generate login code: fam0000001-01
        var loginCode = $"{family.Code}-{nextSeq:D2}";

        var child = new User
        {
            FullName = dto.FullName,
            Email = loginCode, // Login code stored in Email field
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = dto.IsAdmin ? UserRole.Admin : UserRole.Child,
            FamilyId = admin.FamilyId,
            AvatarUrl = dto.AvatarUrl,
            ChildSequence = nextSeq
        };
        await _uow.Users.AddAsync(child);
        await _uow.SaveChangesAsync();

        // Create wallet
        var wallet = new Wallet { ChildId = child.Id, Balance = 0 };
        await _uow.Wallets.AddAsync(wallet);
        await _uow.SaveChangesAsync();

        return MapToDto(child, 0);
    }

    public async Task<UserDto> UpdateChildAsync(int childId, UpdateChildDto dto, int adminId)
    {
        var admin = await _uow.Users.GetByIdAsync(adminId)
            ?? throw new KeyNotFoundException("Admin not found.");

        var child = await _context.Users
            .Include(u => u.Wallet)
            .FirstOrDefaultAsync(u => u.Id == childId && u.FamilyId == admin.FamilyId && u.ChildSequence != null)
            ?? throw new KeyNotFoundException("User not found.");

        if (!string.IsNullOrWhiteSpace(dto.FullName)) 
            child.FullName = dto.FullName;
        if (dto.AvatarUrl != null) 
            child.AvatarUrl = dto.AvatarUrl;

        _uow.Users.Update(child);
        await _uow.SaveChangesAsync();

        return MapToDto(child, child.Wallet?.Balance ?? 0);
    }

    public async Task ResetChildPasswordAsync(int childId, ResetPasswordDto dto, int adminId)
    {
        var admin = await _uow.Users.GetByIdAsync(adminId)
            ?? throw new KeyNotFoundException("Admin not found.");

        var child = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == childId && u.FamilyId == admin.FamilyId && u.ChildSequence != null)
            ?? throw new KeyNotFoundException("User not found.");

        child.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
        _uow.Users.Update(child);
        await _uow.SaveChangesAsync();
    }

    public async Task ChangePasswordAsync(int userId, ChangePasswordDto dto)
    {
        var user = await _uow.Users.GetByIdAsync(userId)
            ?? throw new KeyNotFoundException("User not found.");

        if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash))
            throw new InvalidOperationException("Current password is incorrect.");

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
        _uow.Users.Update(user);
        await _uow.SaveChangesAsync();
    }

    public async Task<IEnumerable<UserDto>> GetChildrenAsync(int familyId)
    {
        var children = await _context.Users
            .Where(u => u.FamilyId == familyId && u.ChildSequence != null)
            .Include(u => u.Wallet)
            .OrderBy(u => u.ChildSequence)
            .ToListAsync();

        return children.Select(c => MapToDto(c, c.Wallet?.Balance ?? 0));
    }

    public async Task<IEnumerable<UserDto>> GetLeaderboardAsync(int familyId)
    {
        var children = await _context.Users
            .Where(u => u.FamilyId == familyId && u.Role == UserRole.Child)
            .Include(u => u.Wallet)
            .OrderByDescending(u => u.Wallet != null ? u.Wallet.Balance : 0)
            .ToListAsync();

        return children.Select(c => MapToDto(c, c.Wallet?.Balance ?? 0));
    }

    private static UserDto MapToDto(User u, int balance) => new()
    {
        Id = u.Id,
        FullName = u.FullName,
        Email = u.Email,
        Role = u.Role.ToString(),
        AvatarUrl = u.AvatarUrl,
        FamilyId = u.FamilyId,
        StarBalance = balance,
        LoginCode = u.ChildSequence != null ? u.Email : null,
        ChildSequence = u.ChildSequence
    };

    public async Task UpdatePreferencesAsync(int userId, UpdatePreferencesDto dto)
    {
        var user = await _uow.Users.GetByIdAsync(userId)
            ?? throw new KeyNotFoundException("User not found.");

        if (!string.IsNullOrWhiteSpace(dto.ThemeColor))
            user.ThemeColor = dto.ThemeColor;
        if (!string.IsNullOrWhiteSpace(dto.Language))
            user.Language = dto.Language;

        _uow.Users.Update(user);
        await _uow.SaveChangesAsync();
    }
}
