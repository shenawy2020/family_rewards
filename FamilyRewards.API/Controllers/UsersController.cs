using System.Security.Claims;
using FamilyRewards.Core.DTOs.User;
using FamilyRewards.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FamilyRewards.API.Controllers;

[ApiController]
[Route("api/users")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;
    public UsersController(IUserService userService) => _userService = userService;

    [HttpPost("add-child")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> AddChild([FromBody] AddChildDto dto)
    {
        var adminId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        return Ok(await _userService.AddChildAsync(dto, adminId));
    }

    [HttpPut("update-child/{childId:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateChild(int childId, [FromBody] UpdateChildDto dto)
    {
        var adminId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        return Ok(await _userService.UpdateChildAsync(childId, dto, adminId));
    }

    [HttpPut("reset-child-password/{childId:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ResetChildPassword(int childId, [FromBody] ResetPasswordDto dto)
    {
        var adminId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        await _userService.ResetChildPasswordAsync(childId, dto, adminId);
        return Ok(new { message = "Password reset successfully." });
    }

    [HttpPut("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        await _userService.ChangePasswordAsync(userId, dto);
        return Ok(new { message = "Password changed successfully." });
    }

    [HttpGet("children")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetChildren()
    {
        var familyId = int.Parse(User.FindFirst("familyId")!.Value);
        return Ok(await _userService.GetChildrenAsync(familyId));
    }

    [HttpGet("leaderboard")]
    public async Task<IActionResult> GetLeaderboard()
    {
        var familyId = int.Parse(User.FindFirst("familyId")!.Value);
        return Ok(await _userService.GetLeaderboardAsync(familyId));
    }

    [HttpPost("{childId:int}/avatar")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UploadAvatar(int childId, IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "No file uploaded." });

        var adminId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        // Limit file size (e.g. 5MB)
        if (file.Length > 5 * 1024 * 1024)
            return BadRequest(new { message = "File is too large." });

        // Ensure directory exists
        var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "avatars");
        if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

        // Generate unique filename
        var ext = Path.GetExtension(file.FileName);
        var uniqueFileName = $"{Guid.NewGuid()}{ext}";
        var filePath = Path.Combine(uploadsFolder, uniqueFileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var avatarUrl = $"/uploads/avatars/{uniqueFileName}";
        // Update user
        var dto = new UpdateChildDto { AvatarUrl = avatarUrl };
        var updatedUser = await _userService.UpdateChildAsync(childId, dto, adminId);

        return Ok(updatedUser);
    }

    [HttpPut("preferences")]
    public async Task<IActionResult> UpdatePreferences([FromBody] UpdatePreferencesDto dto)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        await _userService.UpdatePreferencesAsync(userId, dto);
        return Ok(new { message = "Preferences updated." });
    }
}
