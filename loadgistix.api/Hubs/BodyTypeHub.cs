using loadgistix.api.Hubs;
using loadgistix.api.Interfaces;
using loadgistix.api.Models;
using Microsoft.AspNetCore.SignalR;

namespace loadgistix.api.Hubs
{
    public class BodyTypeHub : Hub<IBodyTypeHubClient>
    {
        public async Task BodyTypeAdded(BodyType item)
        {
            await Clients.All.BodyTypeAdded(item);
        }
        public async Task BodyTypeUpdated(BodyType item)
        {
            await Clients.All.BodyTypeUpdated(item);
        }
        public async Task BodyTypeDeleted(Guid id)
        {
            await Clients.All.BodyTypeDeleted(id);
        }
    }
}