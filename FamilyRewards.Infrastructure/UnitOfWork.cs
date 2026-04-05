using FamilyRewards.Core.Entities;
using FamilyRewards.Core.Interfaces;
using FamilyRewards.Infrastructure.Data;
using FamilyRewards.Infrastructure.Repositories;

namespace FamilyRewards.Infrastructure;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;
    private bool _disposed = false;

    public IRepository<Family> Families { get; }
    public IRepository<User> Users { get; }
    public IRepository<FamilyTask> Tasks { get; }
    public IRepository<TaskCompletion> TaskCompletions { get; }
    public IRepository<Reward> Rewards { get; }
    public IRepository<Wallet> Wallets { get; }
    public IRepository<WalletTransaction> WalletTransactions { get; }
    public IRepository<Penalty> Penalties { get; }

    public UnitOfWork(AppDbContext context)
    {
        _context = context;
        Families = new GenericRepository<Family>(context);
        Users = new GenericRepository<User>(context);
        Tasks = new GenericRepository<FamilyTask>(context);
        TaskCompletions = new GenericRepository<TaskCompletion>(context);
        Rewards = new GenericRepository<Reward>(context);
        Wallets = new GenericRepository<Wallet>(context);
        WalletTransactions = new GenericRepository<WalletTransaction>(context);
        Penalties = new GenericRepository<Penalty>(context);
    }

    public async Task<int> SaveChangesAsync() => await _context.SaveChangesAsync();

    protected virtual void Dispose(bool disposing)
    {
        if (!_disposed && disposing)
            _context.Dispose();
        _disposed = true;
    }

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }
}
