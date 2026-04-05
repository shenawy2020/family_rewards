using FamilyRewards.Core.DTOs.Rewards;
using FamilyRewards.Core.Entities;
using FamilyRewards.Core.Enums;
using FamilyRewards.Core.Interfaces;
using FamilyRewards.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FamilyRewards.Infrastructure.Services;

public class RewardService : IRewardService
{
    private readonly IUnitOfWork _uow;
    private readonly AppDbContext _context;

    public RewardService(IUnitOfWork uow, AppDbContext context)
    {
        _uow = uow;
        _context = context;
    }

    public async Task<RewardDto> CreateRewardAsync(CreateRewardDto dto, int adminId, int familyId)
    {
        var reward = new Reward
        {
            Title = dto.Title,
            Description = dto.Description,
            StarsCost = dto.StarsCost,
            CreatedBy = adminId,
            FamilyId = familyId
        };
        await _uow.Rewards.AddAsync(reward);
        await _uow.SaveChangesAsync();
        return MapToDto(reward);
    }

    public async Task<IEnumerable<RewardDto>> GetRewardsAsync(int familyId)
    {
        var rewards = await _context.Rewards
            .Where(r => r.FamilyId == familyId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
        return rewards.Select(MapToDto);
    }

    public async Task RedeemRewardAsync(RedeemRewardDto dto, int childId)
    {
        var reward = await _uow.Rewards.GetByIdAsync(dto.RewardId)
            ?? throw new KeyNotFoundException("Reward not found.");

        var wallet = await _uow.Wallets.FirstOrDefaultAsync(w => w.ChildId == childId)
            ?? throw new KeyNotFoundException("Wallet not found.");

        if (wallet.Balance < reward.StarsCost)
            throw new InvalidOperationException("Insufficient stars balance.");

        wallet.Balance -= reward.StarsCost;
        _uow.Wallets.Update(wallet);

        var tx = new WalletTransaction
        {
            ChildId = childId,
            Amount = -reward.StarsCost,
            Type = TransactionType.Redeem,
            Description = $"Redeemed reward: {reward.Title}"
        };
        await _uow.WalletTransactions.AddAsync(tx);
        await _uow.SaveChangesAsync();
    }

    private static RewardDto MapToDto(Reward r) => new()
    {
        Id = r.Id,
        Title = r.Title,
        Description = r.Description,
        StarsCost = r.StarsCost,
        CreatedBy = r.CreatedBy,
        CreatedAt = r.CreatedAt
    };
}
