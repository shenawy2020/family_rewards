using FamilyRewards.Core.Enums;

namespace FamilyRewards.Core.Entities;

public class User
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty; // For Admin: email, For Child: login code (e.g. fam0000001-01)
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public int FamilyId { get; set; }
    public string? AvatarUrl { get; set; }
    public int? ChildSequence { get; set; } // sequence within family for children
    public string? ResetToken { get; set; }
    public DateTime? ResetTokenExpiry { get; set; }

    public Family Family { get; set; } = null!;
    public Wallet? Wallet { get; set; }
    public ICollection<TaskCompletion> TaskCompletions { get; set; } = new List<TaskCompletion>();
    public ICollection<Penalty> Penalties { get; set; } = new List<Penalty>();
    public ICollection<WalletTransaction> WalletTransactions { get; set; } = new List<WalletTransaction>();
}
