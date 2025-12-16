using loadgistix.api.Hubs;
using loadgistix.api.Interfaces;
using loadgistix.api.Models;
using Microsoft.AspNetCore.SignalR;

namespace loadgistix.api.Hubs
{
    public class DriverHub : Hub<IDriverHubClient>
    {
        public async Task DriverAdded(Driver item)
        {
            await Clients.All.DriverAdded(item);
        }
        public async Task DriverUpdated(Driver item)
        {
            await Clients.All.DriverUpdated(item);
        }
        public async Task DriverDeleted(Guid id)
        {
            await Clients.All.DriverDeleted(id);
        }
    }
}