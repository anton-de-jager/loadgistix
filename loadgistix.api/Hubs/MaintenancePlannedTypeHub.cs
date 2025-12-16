using loadgistix.api.Hubs;
using loadgistix.api.Interfaces;
using loadgistix.api.Models;
using Microsoft.AspNetCore.SignalR;

namespace loadgistix.api.Hubs
{
    public class MaintenancePlannedTypeHub : Hub<IMaintenancePlannedTypeHubClient>
    {
        public async Task MaintenancePlannedTypeAdded(MaintenancePlannedType item)
        {
            await Clients.All.MaintenancePlannedTypeAdded(item);
        }
        public async Task MaintenancePlannedTypeUpdated(MaintenancePlannedType item)
        {
            await Clients.All.MaintenancePlannedTypeUpdated(item);
        }
        public async Task MaintenancePlannedTypeDeleted(Guid id)
        {
            await Clients.All.MaintenancePlannedTypeDeleted(id);
        }
    }
}