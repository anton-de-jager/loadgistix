using loadgistix.api.Hubs;
using loadgistix.api.Interfaces;
using loadgistix.api.Models;
using Microsoft.AspNetCore.SignalR;

namespace loadgistix.api.Hubs
{
    public class DirectoryHub : Hub<IDirectoryHubClient>
    {
        public async Task DirectoryAdded(Models.Directory directory)
        {
            await Clients.All.DirectoryAdded(directory);
        }
        public async Task DirectoryUpdated(Models.Directory directory)
        {
            await Clients.All.DirectoryUpdated(directory);
        }
        public async Task DirectoryDeleted(Guid id)
        {
            await Clients.All.DirectoryDeleted(id);
        }
    }
}