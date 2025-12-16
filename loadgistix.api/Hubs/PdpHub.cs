using loadgistix.api.Hubs;
using loadgistix.api.Interfaces;
using loadgistix.api.Models;
using Microsoft.AspNetCore.SignalR;

namespace loadgistix.api.Hubs
{
    public class PdpHub : Hub<IPdpHubClient>
    {
        public async Task PdpAdded(Pdp item)
        {
            await Clients.All.PdpAdded(item);
        }
        public async Task PdpUpdated(Pdp item)
        {
            await Clients.All.PdpUpdated(item);
        }
        public async Task PdpDeleted(Guid id)
        {
            await Clients.All.PdpDeleted(id);
        }
    }
}