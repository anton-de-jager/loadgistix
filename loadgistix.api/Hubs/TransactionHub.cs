using loadgistix.api.Hubs;
using loadgistix.api.Interfaces;
using loadgistix.api.Models;
using Microsoft.AspNetCore.SignalR;

namespace loadgistix.api.Hubs
{
    public class TransactionHub : Hub<ITransactionHubClient>
    {
        public async Task TransactionAdded(Transaction item)
        {
            await Clients.All.TransactionAdded(item);
        }
        public async Task TransactionUpdated(Transaction item)
        {
            await Clients.All.TransactionUpdated(item);
        }
        public async Task TransactionDeleted(Guid id)
        {
            await Clients.All.TransactionDeleted(id);
        }
    }
}