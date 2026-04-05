using FamilyRewards.Core.Enums;

namespace FamilyRewards.Core.DTOs.Wallet;

public class TransactionDto
{
    public int Id { get; set; }
    public int ChildId { get; set; }
    public int Amount { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
