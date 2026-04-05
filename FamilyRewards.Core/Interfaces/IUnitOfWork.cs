using FamilyRewards.Core.Entities;

namespace FamilyRewards.Core.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IRepository<Family> Families { get; }
    IRepository<User> Users { get; }
    IRepository<FamilyTask> Tasks { get; }
    IRepository<TaskCompletion> TaskCompletions { get; }
    IRepository<Reward> Rewards { get; }
    IRepository<Wallet> Wallets { get; }
    IRepository<WalletTransaction> WalletTransactions { get; }
    IRepository<Penalty> Penalties { get; }
    Task<int> SaveChangesAsync();
}
