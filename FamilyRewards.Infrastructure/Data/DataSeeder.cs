using FamilyRewards.Core.Entities;
using FamilyRewards.Core.Enums;
using Microsoft.EntityFrameworkCore;

namespace FamilyRewards.Infrastructure.Data;

public static class DataSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        if (await context.Families.AnyAsync()) return;

        // Seed Family with code
        var family = new Family { Name = "The Smith Family", Code = "fam0000001", CreatedAt = DateTime.UtcNow };
        context.Families.Add(family);
        await context.SaveChangesAsync();

        // Seed Admin (Father)
        var father = new User
        {
            FullName = "John Smith",
            Email = "father@family.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
            Role = UserRole.Admin,
            FamilyId = family.Id,
            AvatarUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
        };
        context.Users.Add(father);

        // Seed Children with login codes
        var child1 = new User
        {
            FullName = "Emma Smith",
            Email = "fam0000001-01", // login code
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Child@123"),
            Role = UserRole.Child,
            FamilyId = family.Id,
            ChildSequence = 1,
            AvatarUrl = "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Emma"
        };
        var child2 = new User
        {
            FullName = "Liam Smith",
            Email = "fam0000001-02", // login code
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Child@123"),
            Role = UserRole.Child,
            FamilyId = family.Id,
            ChildSequence = 2,
            AvatarUrl = "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Liam"
        };
        context.Users.AddRange(child1, child2);
        await context.SaveChangesAsync();

        // Seed Wallets
        context.Wallets.AddRange(
            new Wallet { ChildId = child1.Id, Balance = 45 },
            new Wallet { ChildId = child2.Id, Balance = 30 }
        );

        // Seed Tasks
        var tasks = new[]
        {
            new FamilyTask { Title = "Clean Your Room", Description = "Tidy up and vacuum your bedroom", Stars = 10, Type = TaskType.Daily, CreatedBy = father.Id, FamilyId = family.Id },
            new FamilyTask { Title = "Do Homework", Description = "Complete all homework assignments", Stars = 15, Type = TaskType.Daily, CreatedBy = father.Id, FamilyId = family.Id },
            new FamilyTask { Title = "Help with Dishes", Description = "Wash or load the dishwasher after dinner", Stars = 8, Type = TaskType.Daily, CreatedBy = father.Id, FamilyId = family.Id },
            new FamilyTask { Title = "Read for 30 Minutes", Description = "Read a book or educational material", Stars = 12, Type = TaskType.Daily, CreatedBy = father.Id, FamilyId = family.Id },
            new FamilyTask { Title = "Tidy the Garden", Description = "Help clean and maintain the garden", Stars = 20, Type = TaskType.Weekly, CreatedBy = father.Id, FamilyId = family.Id },
        };
        context.Tasks.AddRange(tasks);

        // Seed Rewards
        var rewards = new[]
        {
            new Reward { Title = "Extra Screen Time", Description = "1 hour of extra gaming/TV time", StarsCost = 20, CreatedBy = father.Id, FamilyId = family.Id },
            new Reward { Title = "Pizza Night Choice", Description = "Pick the toppings for Friday pizza", StarsCost = 30, CreatedBy = father.Id, FamilyId = family.Id },
            new Reward { Title = "Movie Night Pick", Description = "Choose the movie for family night", StarsCost = 25, CreatedBy = father.Id, FamilyId = family.Id },
            new Reward { Title = "New Book", Description = "Get a new book of your choice", StarsCost = 50, CreatedBy = father.Id, FamilyId = family.Id },
            new Reward { Title = "Ice Cream Trip", Description = "Trip to the ice cream shop", StarsCost = 40, CreatedBy = father.Id, FamilyId = family.Id },
        };
        context.Rewards.AddRange(rewards);

        await context.SaveChangesAsync();

        // Seed Wallet Transactions
        context.WalletTransactions.AddRange(
            new WalletTransaction { ChildId = child1.Id, Amount = 15, Type = TransactionType.Reward, Description = "Task completed: Do Homework", CreatedAt = DateTime.UtcNow.AddDays(-3) },
            new WalletTransaction { ChildId = child1.Id, Amount = 10, Type = TransactionType.Reward, Description = "Task completed: Clean Your Room", CreatedAt = DateTime.UtcNow.AddDays(-2) },
            new WalletTransaction { ChildId = child1.Id, Amount = -5, Type = TransactionType.Penalty, Description = "Penalty: Left toys on stairs", CreatedAt = DateTime.UtcNow.AddDays(-1) },
            new WalletTransaction { ChildId = child1.Id, Amount = 25, Type = TransactionType.Reward, Description = "Task completed: Tidy the Garden", CreatedAt = DateTime.UtcNow.AddDays(-1) },
            new WalletTransaction { ChildId = child2.Id, Amount = 12, Type = TransactionType.Reward, Description = "Task completed: Read for 30 Minutes", CreatedAt = DateTime.UtcNow.AddDays(-2) },
            new WalletTransaction { ChildId = child2.Id, Amount = 18, Type = TransactionType.Reward, Description = "Task completed: Help with Dishes", CreatedAt = DateTime.UtcNow.AddDays(-1) }
        );

        await context.SaveChangesAsync();
    }
}
