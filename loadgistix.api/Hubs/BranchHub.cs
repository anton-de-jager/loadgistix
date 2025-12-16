using loadgistix.api.Hubs;
using loadgistix.api.Interfaces;
using loadgistix.api.Models;
using Microsoft.AspNetCore.SignalR;

namespace loadgistix.api.Hubs
{
    public class BranchHub : Hub<IBranchHubClient>
    {
        public async Task BranchAdded(Branch item)
        {
            await Clients.All.BranchAdded(item);
        }
        public async Task BranchUpdated(Branch item)
        {
            await Clients.All.BranchUpdated(item);
        }
        public async Task BranchDeleted(Guid id)
        {
            await Clients.All.BranchDeleted(id);
        }
    }
}