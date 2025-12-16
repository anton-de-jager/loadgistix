using loadgistix.api.Hubs;
using loadgistix.api.Interfaces;
using loadgistix.api.Models;
using Microsoft.AspNetCore.SignalR;

namespace loadgistix.api.Hubs
{
    public class FuelHub : Hub<IFuelHubClient>
    {
        public async Task FuelAdded(Fuel item)
        {
            await Clients.All.FuelAdded(item);
        }
        public async Task FuelUpdated(Fuel item)
        {
            await Clients.All.FuelUpdated(item);
        }
        public async Task FuelDeleted(Guid id)
        {
            await Clients.All.FuelDeleted(id);
        }
    }
}