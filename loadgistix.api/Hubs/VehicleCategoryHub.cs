using loadgistix.api.Hubs;
using loadgistix.api.Interfaces;
using loadgistix.api.Models;
using Microsoft.AspNetCore.SignalR;

namespace loadgistix.api.Hubs
{
    public class VehicleCategoryHub : Hub<IVehicleCategoryHubClient>
    {
        public async Task VehicleCategoryAdded(VehicleCategory item)
        {
            await Clients.All.VehicleCategoryAdded(item);
        }
        public async Task VehicleCategoryUpdated(VehicleCategory item)
        {
            await Clients.All.VehicleCategoryUpdated(item);
        }
        public async Task VehicleCategoryDeleted(Guid id)
        {
            await Clients.All.VehicleCategoryDeleted(id);
        }
    }
}