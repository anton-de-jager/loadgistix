using loadgistix.api.Hubs;
using loadgistix.api.Interfaces;
using loadgistix.api.Models;
using Microsoft.AspNetCore.SignalR;

namespace loadgistix.api.Hubs
{
    public class AxelHub : Hub<IAxelHubClient>
    {
        public async Task AxelAdded(Axel item)
        {
            await Clients.All.AxelAdded(item);
        }
        public async Task AxelUpdated(Axel item)
        {
            await Clients.All.AxelUpdated(item);
        }
        public async Task AxelDeleted(Guid id)
        {
            await Clients.All.AxelDeleted(id);
        }
    }
}