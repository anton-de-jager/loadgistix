using loadgistix.api.Hubs;
using loadgistix.api.Interfaces;
using loadgistix.api.Models;
using Microsoft.AspNetCore.SignalR;

namespace loadgistix.api.Hubs
{
    public class ModelHub : Hub<IModelHubClient>
    {
        public async Task ModelAdded(Model item)
        {
            await Clients.All.ModelAdded(item);
        }
        public async Task ModelUpdated(Model item)
        {
            await Clients.All.ModelUpdated(item);
        }
        public async Task ModelDeleted(Guid id)
        {
            await Clients.All.ModelDeleted(id);
        }
    }
}