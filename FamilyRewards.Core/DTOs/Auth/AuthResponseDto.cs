namespace FamilyRewards.Core.DTOs.Auth;

public class AuthResponseDto
{
    public string Token { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public int UserId { get; set; }
    public int FamilyId { get; set; }
    public string FamilyCode { get; set; } = string.Empty;
    public string? LoginCode { get; set; }
    public string? AvatarUrl { get; set; }
    public string ThemeColor { get; set; } = "teal";
    public string Language { get; set; } = "en";
}
