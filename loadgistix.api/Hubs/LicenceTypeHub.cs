using loadgistix.api.Hubs;
using loadgistix.api.Interfaces;
using loadgistix.api.Models;
using Microsoft.AspNetCore.SignalR;

namespace loadgistix.api.Hubs
{
    public class LicenceTypeHub : Hub<ILicenceTypeHubClient>
    {
        public async Task LicenceTypeAdded(LicenceType item)
        {
            await Clients.All.LicenceTypeAdded(item);
        }
        public async Task LicenceTypeUpdated(LicenceType item)
        {
            await Clients.All.LicenceTypeUpdated(item);
        }
        public async Task LicenceTypeDeleted(Guid id)
        {
            await Clients.All.LicenceTypeDeleted(id);
        }
    }
}