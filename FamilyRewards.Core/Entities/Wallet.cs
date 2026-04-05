namespace FamilyRewards.Core.Entities;

public class Wallet
{
    public int Id { get; set; }
    public int ChildId { get; set; }
    public int Balance { get; set; } = 0;

    public User Child { get; set; } = null!;
    public ICollection<WalletTransaction> Transactions { get; set; } = new List<WalletTransaction>();
}
