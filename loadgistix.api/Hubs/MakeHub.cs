using loadgistix.api.Hubs;
using loadgistix.api.Interfaces;
using loadgistix.api.Models;
using Microsoft.AspNetCore.SignalR;

namespace loadgistix.api.Hubs
{
    public class MakeHub : Hub<IMakeHubClient>
    {
        public async Task MakeAdded(Make item)
        {
            await Clients.All.MakeAdded(item);
        }
        public async Task MakeUpdated(Make item)
        {
            await Clients.All.MakeUpdated(item);
        }
        public async Task MakeDeleted(Guid id)
        {
            await Clients.All.MakeDeleted(id);
        }
    }
}