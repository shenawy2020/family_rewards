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
}
