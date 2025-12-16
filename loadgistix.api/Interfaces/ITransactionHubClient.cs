using loadgistix.api.Models;

namespace loadgistix.api.Interfaces
{
    public interface ITransactionHubClient
    {
        Task TransactionAdded(Transaction item);
        Task TransactionUpdated(Transaction item);
        Task TransactionDeleted(Guid id);
    }

}
