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

        var existing = await _uow.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
        if (existing != null)
            throw new InvalidOperationException("Email already in use.");

        var child = new User
        {
            FullName = dto.FullName,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = UserRole.Child,
            FamilyId = admin.FamilyId,
            AvatarUrl = dto.AvatarUrl
        };
        await _uow.Users.AddAsync(child);
        await _uow.SaveChangesAsync();

        // Create wallet for child
        var wallet = new Wallet { ChildId = child.Id, Balance = 0 };
        await _uow.Wallets.AddAsync(wallet);
        await _uow.SaveChangesAsync();

        return MapToDto(child, 0);
    }

    public async Task<IEnumerable<UserDto>> GetChildrenAsync(int familyId)
    {
        var children = await _context.Users
            .Where(u => u.FamilyId == familyId && u.Role == UserRole.Child)
            .Include(u => u.Wallet)
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
        StarBalance = balance
    };
}
