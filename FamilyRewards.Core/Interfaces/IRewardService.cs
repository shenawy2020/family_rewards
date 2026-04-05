using FamilyRewards.Core.DTOs.Rewards;

namespace FamilyRewards.Core.Interfaces;

public interface IRewardService
{
    Task<RewardDto> CreateRewardAsync(CreateRewardDto dto, int adminId, int familyId);
    Task<IEnumerable<RewardDto>> GetRewardsAsync(int familyId);
    Task RedeemRewardAsync(RedeemRewardDto dto, int childId);
}
