using FamilyRewards.Core.DTOs.Wallet;

namespace FamilyRewards.Core.Interfaces;

public interface IWalletService
{
    Task<WalletDto> GetWalletAsync(int childId);
    Task<IEnumerable<TransactionDto>> GetTransactionsAsync(int childId);
    Task<WalletDto> AddStarsAsync(AddStarsDto dto, int adminId);
    Task<WalletDto> DeliverGiftAsync(DeliverGiftDto dto, int adminId);
}
