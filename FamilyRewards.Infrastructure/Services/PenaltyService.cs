using FamilyRewards.Core.DTOs.Penalty;
using FamilyRewards.Core.Entities;
using FamilyRewards.Core.Enums;
using FamilyRewards.Core.Interfaces;
using FamilyRewards.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FamilyRewards.Infrastructure.Services;

public class PenaltyService : IPenaltyService
{
    private readonly IUnitOfWork _uow;
    private readonly AppDbContext _context;

    public PenaltyService(IUnitOfWork uow, AppDbContext context)
    {
        _uow = uow;
        _context = context;
    }

    public async Task<PenaltyDto> CreatePenaltyAsync(CreatePenaltyDto dto, int adminId)
    {
        var child = await _uow.Users.GetByIdAsync(dto.ChildId)
            ?? throw new KeyNotFoundException("Child not found.");

        var admin = await _uow.Users.GetByIdAsync(adminId)
            ?? throw new KeyNotFoundException("Admin not found.");

        var penalty = new Penalty
        {
            ChildId = dto.ChildId,
            StarsDeducted = dto.StarsDeducted,
            Reason = dto.Reason,
            CreatedBy = adminId
        };
        await _uow.Penalties.AddAsync(penalty);

        // Deduct from wallet
        var wallet = await _uow.Wallets.FirstOrDefaultAsync(w => w.ChildId == dto.ChildId);
        if (wallet != null)
        {
            wallet.Balance = Math.Max(0, wallet.Balance - dto.StarsDeducted);
            _uow.Wallets.Update(wallet);
        }

        // Record transaction
        var tx = new WalletTransaction
        {
            ChildId = dto.ChildId,
            Amount = -dto.StarsDeducted,
            Type = TransactionType.Penalty,
            Description = $"Penalty: {dto.Reason}"
        };
        await _uow.WalletTransactions.AddAsync(tx);
        await _uow.SaveChangesAsync();

        return new PenaltyDto
        {
            Id = penalty.Id,
            ChildId = penalty.ChildId,
            ChildName = child.FullName,
            StarsDeducted = penalty.StarsDeducted,
            Reason = penalty.Reason,
            CreatedBy = penalty.CreatedBy,
            CreatedByName = admin.FullName,
            CreatedAt = penalty.CreatedAt
        };
    }

    public async Task<IEnumerable<PenaltyDto>> GetPenaltiesAsync(int childId)
    {
        var penalties = await _context.Penalties
            .Include(p => p.Child)
            .Include(p => p.Creator)
            .Where(p => p.ChildId == childId)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();

        return penalties.Select(p => new PenaltyDto
        {
            Id = p.Id,
            ChildId = p.ChildId,
            ChildName = p.Child.FullName,
            StarsDeducted = p.StarsDeducted,
            Reason = p.Reason,
            CreatedBy = p.CreatedBy,
            CreatedByName = p.Creator.FullName,
            CreatedAt = p.CreatedAt
        });
    }
}
