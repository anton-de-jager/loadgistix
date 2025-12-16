using loadgistix.api.Hubs;
using loadgistix.api.Interfaces;
using loadgistix.api.Models;
using Microsoft.AspNetCore.SignalR;

namespace loadgistix.api.Hubs
{
    public class LoadTypeHub : Hub<ILoadTypeHubClient>
    {
        public async Task LoadTypeAdded(LoadType item)
        {
            await Clients.All.LoadTypeAdded(item);
        }
        public async Task LoadTypeUpdated(LoadType item)
        {
            await Clients.All.LoadTypeUpdated(item);
        }
        public async Task LoadTypeDeleted(Guid id)
        {
            await Clients.All.LoadTypeDeleted(id);
        }
    }
}