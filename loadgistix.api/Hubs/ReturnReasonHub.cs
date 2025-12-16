using loadgistix.api.Hubs;
using loadgistix.api.Interfaces;
using loadgistix.api.Models;
using Microsoft.AspNetCore.SignalR;

namespace loadgistix.api.Hubs
{
    public class ReturnReasonHub : Hub<IReturnReasonHubClient>
    {
        public async Task ReturnReasonAdded(ReturnReason item)
        {
            await Clients.All.ReturnReasonAdded(item);
        }
        public async Task ReturnReasonUpdated(ReturnReason item)
        {
            await Clients.All.ReturnReasonUpdated(item);
        }
        public async Task ReturnReasonDeleted(Guid id)
        {
            await Clients.All.ReturnReasonDeleted(id);
        }
    }
}