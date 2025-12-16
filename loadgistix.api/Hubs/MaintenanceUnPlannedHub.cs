using loadgistix.api.Hubs;
using loadgistix.api.Interfaces;
using loadgistix.api.Models;
using Microsoft.AspNetCore.SignalR;

namespace loadgistix.api.Hubs
{
    public class MaintenanceUnPlannedHub : Hub<IMaintenanceUnPlannedHubClient>
    {
        public async Task MaintenanceUnPlannedAdded(MaintenanceUnPlanned item)
        {
            await Clients.All.MaintenanceUnPlannedAdded(item);
        }
        public async Task MaintenanceUnPlannedUpdated(MaintenanceUnPlanned item)
        {
            await Clients.All.MaintenanceUnPlannedUpdated(item);
        }
        public async Task MaintenanceUnPlannedDeleted(Guid id)
        {
            await Clients.All.MaintenanceUnPlannedDeleted(id);
        }
    }
}