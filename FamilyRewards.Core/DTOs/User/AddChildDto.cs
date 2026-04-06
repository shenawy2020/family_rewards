namespace FamilyRewards.Core.DTOs.User;

public class AddChildDto
{
    public string FullName { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public bool IsAdmin { get; set; }
}
