using loadgistix.api.Hubs;
using loadgistix.api.Interfaces;
using loadgistix.api.Models;
using Microsoft.AspNetCore.SignalR;

namespace loadgistix.api.Hubs
{
    public class DirectoryCategoryHub : Hub<IDirectoryCategoryHubClient>
    {
        public async Task DirectoryCategoryAdded(DirectoryCategory directoryCategory)
        {
            await Clients.All.DirectoryCategoryAdded(directoryCategory);
        }
        public async Task DirectoryCategoryUpdated(DirectoryCategory directoryCategory)
        {
            await Clients.All.DirectoryCategoryUpdated(directoryCategory);
        }
        public async Task DirectoryCategoryDeleted(Guid id)
        {
            await Clients.All.DirectoryCategoryDeleted(id);
        }
    }
}