using FamilyRewards.Core.Enums;

namespace FamilyRewards.Core.Entities;

public class WalletTransaction
{
    public int Id { get; set; }
    public int ChildId { get; set; }
    public int Amount { get; set; }
    public TransactionType Type { get; set; }
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User Child { get; set; } = null!;
}
