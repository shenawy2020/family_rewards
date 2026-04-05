using FamilyRewards.Core.Enums;

namespace FamilyRewards.Core.Entities;

public class User
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public int FamilyId { get; set; }
    public string? AvatarUrl { get; set; }

    public Family Family { get; set; } = null!;
    public Wallet? Wallet { get; set; }
    public ICollection<TaskCompletion> TaskCompletions { get; set; } = new List<TaskCompletion>();
    public ICollection<Penalty> Penalties { get; set; } = new List<Penalty>();
    public ICollection<WalletTransaction> WalletTransactions { get; set; } = new List<WalletTransaction>();
}
