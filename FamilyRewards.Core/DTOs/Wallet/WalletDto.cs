using FamilyRewards.Core.Enums;

namespace FamilyRewards.Core.DTOs.Wallet;

public class WalletDto
{
    public int Id { get; set; }
    public int ChildId { get; set; }
    public string ChildName { get; set; } = string.Empty;
    public int Balance { get; set; }
}
