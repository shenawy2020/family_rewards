using System.Security.Claims;
using FamilyRewards.Core.DTOs.Rewards;
using FamilyRewards.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FamilyRewards.API.Controllers;

[ApiController]
[Route("api/rewards")]
[Authorize]
public class RewardsController : ControllerBase
{
    private readonly IRewardService _rewardService;
    public RewardsController(IRewardService rewardService) => _rewardService = rewardService;

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateReward([FromBody] CreateRewardDto dto)
    {
        var adminId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var familyId = int.Parse(User.FindFirst("familyId")!.Value);
        return Ok(await _rewardService.CreateRewardAsync(dto, adminId, familyId));
    }

    [HttpGet]
    public async Task<IActionResult> GetRewards()
    {
        var familyId = int.Parse(User.FindFirst("familyId")!.Value);
        return Ok(await _rewardService.GetRewardsAsync(familyId));
    }

    [HttpPost("redeem")]
    [Authorize(Roles = "Child")]
    public async Task<IActionResult> RedeemReward([FromBody] RedeemRewardDto dto)
    {
        var childId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        await _rewardService.RedeemRewardAsync(dto, childId);
        return Ok(new { message = "Reward redeemed successfully!" });
    }
}
