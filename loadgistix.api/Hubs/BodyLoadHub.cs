using loadgistix.api.Hubs;
using loadgistix.api.Interfaces;
using loadgistix.api.Models;
using Microsoft.AspNetCore.SignalR;

namespace loadgistix.api.Hubs
{
    public class BodyLoadHub : Hub<IBodyLoadHubClient>
    {
        public async Task BodyLoadAdded(BodyLoad item)
        {
            await Clients.All.BodyLoadAdded(item);
        }
        public async Task BodyLoadUpdated(BodyLoad item)
        {
            await Clients.All.BodyLoadUpdated(item);
        }
        public async Task BodyLoadDeleted(Guid id)
        {
            await Clients.All.BodyLoadDeleted(id);
        }
    }
}