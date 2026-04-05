using FamilyRewards.Core.DTOs.User;

namespace FamilyRewards.Core.Interfaces;

public interface IUserService
{
    Task<UserDto> AddChildAsync(AddChildDto dto, int adminId);
    Task<IEnumerable<UserDto>> GetChildrenAsync(int familyId);
    Task<IEnumerable<UserDto>> GetLeaderboardAsync(int familyId);
}
