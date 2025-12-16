using loadgistix.api.Hubs;
using loadgistix.api.Interfaces;
using loadgistix.api.Models;
using Microsoft.AspNetCore.SignalR;

namespace loadgistix.api.Hubs
{
    public class UserHub : Hub<IUserHubClient>
    {
        public async Task UserAdded(User item)
        {
            await Clients.All.UserAdded(item);
        }
        public async Task UserUpdated(User item)
        {
            await Clients.All.UserUpdated(item);
        }
        public async Task UserDeleted(Guid id)
        {
            await Clients.All.UserDeleted(id);
        }
    }
}