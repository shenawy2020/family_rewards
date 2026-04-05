using FamilyRewards.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FamilyRewards.API.Controllers;

[ApiController]
[Route("api/family")]
[Authorize]
public class FamilyController : ControllerBase
{
    private readonly IUnitOfWork _uow;
    public FamilyController(IUnitOfWork uow) => _uow = uow;

    [HttpGet("me")]
    public async Task<IActionResult> GetMyFamily()
    {
        if (!int.TryParse(User.FindFirst("familyId")?.Value, out int familyId))
            return Unauthorized();
        var family = await _uow.Families.GetByIdAsync(familyId);
        if (family == null) return NotFound();
        return Ok(new { family.Id, family.Name, family.CreatedAt });
    }
}
