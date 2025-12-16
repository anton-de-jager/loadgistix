using loadgistix.api.Hubs;
using loadgistix.api.Interfaces;
using loadgistix.api.Models;
using Microsoft.AspNetCore.SignalR;

namespace loadgistix.api.Hubs
{
    public class MaintenancePlannedHub : Hub<IMaintenancePlannedHubClient>
    {
        public async Task MaintenancePlannedAdded(MaintenancePlanned item)
        {
            await Clients.All.MaintenancePlannedAdded(item);
        }
        public async Task MaintenancePlannedUpdated(MaintenancePlanned item)
        {
            await Clients.All.MaintenancePlannedUpdated(item);
        }
        public async Task MaintenancePlannedDeleted(Guid id)
        {
            await Clients.All.MaintenancePlannedDeleted(id);
        }
    }
}