using loadgistix.api.Hubs;
using loadgistix.api.Interfaces;
using loadgistix.api.Models;
using Microsoft.AspNetCore.SignalR;

namespace loadgistix.api.Hubs
{
    public class VehicleHub : Hub<IVehicleHubClient>
    {
        public async Task VehicleAdded(Vehicle vehicle)
        {
            await Clients.All.VehicleAdded(vehicle);
        }
        public async Task VehicleUpdated(Vehicle vehicle)
        {
            await Clients.All.VehicleUpdated(vehicle);
        }
        public async Task VehicleDeleted(Guid id)
        {
            await Clients.All.VehicleDeleted(id);
        }
    }
}