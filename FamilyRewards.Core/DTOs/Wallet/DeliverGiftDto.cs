namespace FamilyRewards.Core.DTOs.Wallet;

public class DeliverGiftDto
{
    public int ChildId { get; set; }
    public int StarsCost { get; set; }
    public string GiftName { get; set; } = string.Empty;
}
