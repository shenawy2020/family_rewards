namespace FamilyRewards.Core.DTOs.Wallet;

public class AddStarsDto
{
    public int ChildId { get; set; }
    public int Amount { get; set; }
    public string Reason { get; set; } = string.Empty;
}
