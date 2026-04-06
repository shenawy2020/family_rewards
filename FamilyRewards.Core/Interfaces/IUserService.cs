using FamilyRewards.Core.DTOs.User;

namespace FamilyRewards.Core.Interfaces;

public interface IUserService
{
    Task<UserDto> AddChildAsync(AddChildDto dto, int adminId);
    Task<UserDto> UpdateChildAsync(int childId, UpdateChildDto dto, int adminId);
    Task ResetChildPasswordAsync(int childId, ResetPasswordDto dto, int adminId);
    Task ChangePasswordAsync(int userId, ChangePasswordDto dto);
    Task<IEnumerable<UserDto>> GetChildrenAsync(int familyId);
    Task<IEnumerable<UserDto>> GetLeaderboardAsync(int familyId);
}
