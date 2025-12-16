using loadgistix.api.Hubs;
using loadgistix.api.Interfaces;
using loadgistix.api.Models;
using Microsoft.AspNetCore.SignalR;

namespace loadgistix.api.Hubs
{
    public class AdvertHub : Hub<IAdvertHubClient>
    {
        public async Task AdvertAdded(Advert item)
        {
            await Clients.All.AdvertAdded(item);
        }
        public async Task AdvertUpdated(Advert item)
        {
            await Clients.All.AdvertUpdated(item);
        }
        public async Task AdvertDeleted(Guid id)
        {
            await Clients.All.AdvertDeleted(id);
        }
    }
}