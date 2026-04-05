using FamilyRewards.Core.DTOs.Wallet;
using FamilyRewards.Core.Interfaces;
using FamilyRewards.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FamilyRewards.Infrastructure.Services;

public class WalletService : IWalletService
{
    private readonly IUnitOfWork _uow;
    private readonly AppDbContext _context;

    public WalletService(IUnitOfWork uow, AppDbContext context)
    {
        _uow = uow;
        _context = context;
    }

    public async Task<WalletDto> GetWalletAsync(int childId)
    {
        var wallet = await _context.Wallets
            .Include(w => w.Child)
            .FirstOrDefaultAsync(w => w.ChildId == childId)
            ?? throw new KeyNotFoundException("Wallet not found.");

        return new WalletDto
        {
            Id = wallet.Id,
            ChildId = wallet.ChildId,
            ChildName = wallet.Child.FullName,
            Balance = wallet.Balance
        };
    }

    public async Task<IEnumerable<TransactionDto>> GetTransactionsAsync(int childId)
    {
        var txs = await _context.WalletTransactions
            .Where(t => t.ChildId == childId)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();

        return txs.Select(t => new TransactionDto
        {
            Id = t.Id,
            ChildId = t.ChildId,
            Amount = t.Amount,
            Type = t.Type.ToString(),
            Description = t.Description,
            CreatedAt = t.CreatedAt
        });
    }
}
