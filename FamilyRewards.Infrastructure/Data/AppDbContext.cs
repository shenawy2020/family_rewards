using FamilyRewards.Core.Entities;
using FamilyRewards.Core.Enums;
using Microsoft.EntityFrameworkCore;

namespace FamilyRewards.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Family> Families => Set<Family>();
    public DbSet<User> Users => Set<User>();
    public DbSet<FamilyTask> Tasks => Set<FamilyTask>();
    public DbSet<TaskCompletion> TaskCompletions => Set<TaskCompletion>();
    public DbSet<Reward> Rewards => Set<Reward>();
    public DbSet<Wallet> Wallets => Set<Wallet>();
    public DbSet<WalletTransaction> WalletTransactions => Set<WalletTransaction>();
    public DbSet<Penalty> Penalties => Set<Penalty>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Family
        modelBuilder.Entity<Family>(e =>
        {
            e.HasKey(f => f.Id);
            e.Property(f => f.Name).IsRequired().HasMaxLength(100);
        });

        // User
        modelBuilder.Entity<User>(e =>
        {
            e.HasKey(u => u.Id);
            e.Property(u => u.Email).IsRequired().HasMaxLength(200);
            e.HasIndex(u => u.Email).IsUnique();
            e.Property(u => u.FullName).IsRequired().HasMaxLength(100);
            e.Property(u => u.Role).HasConversion<int>();

            e.HasOne(u => u.Family)
             .WithMany(f => f.Members)
             .HasForeignKey(u => u.FamilyId)
             .OnDelete(DeleteBehavior.Restrict);
        });

        // FamilyTask
        modelBuilder.Entity<FamilyTask>(e =>
        {
            e.HasKey(t => t.Id);
            e.Property(t => t.Title).IsRequired().HasMaxLength(200);
            e.Property(t => t.Type).HasConversion<int>();

            e.HasOne(t => t.Creator)
             .WithMany()
             .HasForeignKey(t => t.CreatedBy)
             .OnDelete(DeleteBehavior.Restrict);

            e.HasOne(t => t.Family)
             .WithMany()
             .HasForeignKey(t => t.FamilyId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // TaskCompletion
        modelBuilder.Entity<TaskCompletion>(e =>
        {
            e.HasKey(tc => tc.Id);
            e.Property(tc => tc.Status).HasConversion<int>();

            e.HasOne(tc => tc.Task)
             .WithMany(t => t.Completions)
             .HasForeignKey(tc => tc.TaskId)
             .OnDelete(DeleteBehavior.Cascade);

            e.HasOne(tc => tc.Child)
             .WithMany(u => u.TaskCompletions)
             .HasForeignKey(tc => tc.ChildId)
             .OnDelete(DeleteBehavior.Restrict);
        });

        // Reward
        modelBuilder.Entity<Reward>(e =>
        {
            e.HasKey(r => r.Id);
            e.Property(r => r.Title).IsRequired().HasMaxLength(200);

            e.HasOne(r => r.Creator)
             .WithMany()
             .HasForeignKey(r => r.CreatedBy)
             .OnDelete(DeleteBehavior.Restrict);

            e.HasOne(r => r.Family)
             .WithMany()
             .HasForeignKey(r => r.FamilyId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // Wallet
        modelBuilder.Entity<Wallet>(e =>
        {
            e.HasKey(w => w.Id);
            e.HasIndex(w => w.ChildId).IsUnique();

            e.HasOne(w => w.Child)
             .WithOne(u => u.Wallet)
             .HasForeignKey<Wallet>(w => w.ChildId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // WalletTransaction
        modelBuilder.Entity<WalletTransaction>(e =>
        {
            e.HasKey(wt => wt.Id);
            e.Property(wt => wt.Type).HasConversion<int>();
            e.Property(wt => wt.Description).HasMaxLength(500);

            e.HasOne(wt => wt.Child)
             .WithMany(u => u.WalletTransactions)
             .HasForeignKey(wt => wt.ChildId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // Penalty
        modelBuilder.Entity<Penalty>(e =>
        {
            e.HasKey(p => p.Id);
            e.Property(p => p.Reason).IsRequired().HasMaxLength(500);

            e.HasOne(p => p.Child)
             .WithMany(u => u.Penalties)
             .HasForeignKey(p => p.ChildId)
             .OnDelete(DeleteBehavior.Restrict);

            e.HasOne(p => p.Creator)
             .WithMany()
             .HasForeignKey(p => p.CreatedBy)
             .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
