using FamilyRewards.Core.DTOs.Auth;
using FamilyRewards.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FamilyRewards.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    public AuthController(IAuthService authService) => _authService = authService;

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto) =>
        Ok(await _authService.RegisterAsync(dto));

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto) =>
        Ok(await _authService.LoginAsync(dto));

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
    {
        await _authService.ForgotPasswordAsync(dto);
        return Ok(new { message = "If the email is registered, a reset link will be sent." });
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordWithTokenDto dto)
    {
        await _authService.ResetPasswordAsync(dto);
        return Ok(new { message = "Password reset successfully." });
    }
}
