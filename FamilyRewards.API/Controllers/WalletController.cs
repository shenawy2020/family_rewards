using System.Security.Claims;
using FamilyRewards.Core.DTOs.Wallet;
using FamilyRewards.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FamilyRewards.API.Controllers;

[ApiController]
[Route("api/wallet")]
[Authorize]
public class WalletController : ControllerBase
{
    private readonly IWalletService _walletService;
    public WalletController(IWalletService walletService) => _walletService = walletService;

    [HttpGet("{childId:int}")]
    public async Task<IActionResult> GetWallet(int childId) =>
        Ok(await _walletService.GetWalletAsync(childId));

    [HttpGet("my-wallet")]
    [Authorize(Roles = "Child")]
    public async Task<IActionResult> GetMyWallet()
    {
        var childId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        return Ok(await _walletService.GetWalletAsync(childId));
    }

    [HttpGet("transactions/{childId:int}")]
    public async Task<IActionResult> GetTransactions(int childId) =>
        Ok(await _walletService.GetTransactionsAsync(childId));

    [HttpPost("add-stars")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> AddStars([FromBody] AddStarsDto dto)
    {
        var adminId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        return Ok(await _walletService.AddStarsAsync(dto, adminId));
    }

    [HttpPost("deliver-gift")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeliverGift([FromBody] DeliverGiftDto dto)
    {
        var adminId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        return Ok(await _walletService.DeliverGiftAsync(dto, adminId));
    }
}
