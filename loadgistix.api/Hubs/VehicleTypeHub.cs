using loadgistix.api.Hubs;
using loadgistix.api.Interfaces;
using loadgistix.api.Models;
using Microsoft.AspNetCore.SignalR;

namespace loadgistix.api.Hubs
{
    public class VehicleTypeHub : Hub<IVehicleTypeHubClient>
    {
        public async Task VehicleTypeAdded(VehicleType item)
        {
            await Clients.All.VehicleTypeAdded(item);
        }
        public async Task VehicleTypeUpdated(VehicleType item)
        {
            await Clients.All.VehicleTypeUpdated(item);
        }
        public async Task VehicleTypeDeleted(Guid id)
        {
            await Clients.All.VehicleTypeDeleted(id);
        }
    }
}