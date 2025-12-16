using loadgistix.api.Hubs;
using loadgistix.api.Interfaces;
using loadgistix.api.Models;
using Microsoft.AspNetCore.SignalR;

namespace loadgistix.api.Hubs
{
    public class LoadHub : Hub<ILoadHubClient>
    {
        public async Task LoadAdded(Load load)
        {
            await Clients.All.LoadAdded(load);
        }
        public async Task LoadUpdated(Load load)
        {
            await Clients.All.LoadUpdated(load);
        }
        public async Task LoadDeleted(Guid id)
        {
            await Clients.All.LoadDeleted(id);
        }
    }
}