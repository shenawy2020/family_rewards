using System.Security.Claims;
using FamilyRewards.Core.DTOs.Penalty;
using FamilyRewards.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FamilyRewards.API.Controllers;

[ApiController]
[Route("api/penalties")]
[Authorize]
public class PenaltiesController : ControllerBase
{
    private readonly IPenaltyService _penaltyService;
    public PenaltiesController(IPenaltyService penaltyService) => _penaltyService = penaltyService;

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreatePenalty([FromBody] CreatePenaltyDto dto)
    {
        var adminId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        return Ok(await _penaltyService.CreatePenaltyAsync(dto, adminId));
    }

    [HttpGet("{childId:int}")]
    public async Task<IActionResult> GetPenalties(int childId) =>
        Ok(await _penaltyService.GetPenaltiesAsync(childId));

    [HttpGet("my-penalties")]
    [Authorize(Roles = "Child")]
    public async Task<IActionResult> GetMyPenalties()
    {
        var childId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        return Ok(await _penaltyService.GetPenaltiesAsync(childId));
    }
}
