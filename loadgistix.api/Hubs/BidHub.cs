using loadgistix.api.Hubs;
using loadgistix.api.Interfaces;
using loadgistix.api.Models;
using Microsoft.AspNetCore.SignalR;

namespace loadgistix.api.Hubs
{
    public class BidHub : Hub<IBidHubClient>
    {
        public async Task BidAdded(Bid bid)
        {
            await Clients.All.BidAdded(bid);
        }
        public async Task BidUpdated(Bid bid)
        {
            await Clients.All.BidUpdated(bid);
        }
        public async Task BidDeleted(Guid id)
        {
            await Clients.All.BidDeleted(id);
        }
    }
}