using FamilyRewards.Core.DTOs.Penalty;

namespace FamilyRewards.Core.Interfaces;

public interface IPenaltyService
{
    Task<PenaltyDto> CreatePenaltyAsync(CreatePenaltyDto dto, int adminId);
    Task<IEnumerable<PenaltyDto>> GetPenaltiesAsync(int childId);
}
