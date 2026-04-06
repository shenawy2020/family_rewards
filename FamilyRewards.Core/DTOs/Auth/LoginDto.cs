namespace FamilyRewards.Core.DTOs.Auth;

public class LoginDto
{
    public string LoginId { get; set; } = string.Empty; // email for admin, code for child (e.g. fam0000001-01)
    public string Password { get; set; } = string.Empty;
}
