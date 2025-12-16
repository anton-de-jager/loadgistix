using loadgistix.api.Hubs;
using loadgistix.api.Interfaces;
using loadgistix.api.Models;
using Microsoft.AspNetCore.SignalR;

namespace loadgistix.api.Hubs
{
    public class StockProblemHub : Hub<IStockProblemHubClient>
    {
        public async Task StockProblemAdded(StockProblem item)
        {
            await Clients.All.StockProblemAdded(item);
        }
        public async Task StockProblemUpdated(StockProblem item)
        {
            await Clients.All.StockProblemUpdated(item);
        }
        public async Task StockProblemDeleted(Guid id)
        {
            await Clients.All.StockProblemDeleted(id);
        }
    }
}