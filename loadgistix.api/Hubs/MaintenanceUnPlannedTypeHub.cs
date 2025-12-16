using loadgistix.api.Hubs;
using loadgistix.api.Interfaces;
using loadgistix.api.Models;
using Microsoft.AspNetCore.SignalR;

namespace loadgistix.api.Hubs
{
    public class MaintenanceUnPlannedTypeHub : Hub<IMaintenanceUnPlannedTypeHubClient>
    {
        public async Task MaintenanceUnPlannedTypeAdded(MaintenanceUnPlannedType item)
        {
            await Clients.All.MaintenanceUnPlannedTypeAdded(item);
        }
        public async Task MaintenanceUnPlannedTypeUpdated(MaintenanceUnPlannedType item)
        {
            await Clients.All.MaintenanceUnPlannedTypeUpdated(item);
        }
        public async Task MaintenanceUnPlannedTypeDeleted(Guid id)
        {
            await Clients.All.MaintenanceUnPlannedTypeDeleted(id);
        }
    }
}