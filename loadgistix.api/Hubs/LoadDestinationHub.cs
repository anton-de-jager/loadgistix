using loadgistix.api.Hubs;
using loadgistix.api.Interfaces;
using loadgistix.api.Models;
using Microsoft.AspNetCore.SignalR;

namespace loadgistix.api.Hubs
{
    public class LoadDestinationHub : Hub<ILoadDestinationHubClient>
    {
        public async Task LoadDestinationAdded(LoadDestination loadDestination)
        {
            await Clients.All.LoadDestinationAdded(loadDestination);
        }
        public async Task LoadDestinationUpdated(LoadDestination loadDestination)
        {
            await Clients.All.LoadDestinationUpdated(loadDestination);
        }
        public async Task LoaDestinationdDeleted(Guid id)
        {
            await Clients.All.LoadDestinationDeleted(id);
        }
    }
}