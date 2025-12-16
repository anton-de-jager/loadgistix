using loadgistix.api.Models;

namespace loadgistix.api.Interfaces
{
    public interface IStockProblemHubClient
    {
        Task StockProblemAdded(StockProblem item);
        Task StockProblemUpdated(StockProblem item);
        Task StockProblemDeleted(Guid id);
    }

}
