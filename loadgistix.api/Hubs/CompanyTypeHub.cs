using loadgistix.api.Hubs;
using loadgistix.api.Interfaces;
using loadgistix.api.Models;
using Microsoft.AspNetCore.SignalR;

namespace loadgistix.api.Hubs
{
    public class CompanyTypeHub : Hub<ICompanyTypeHubClient>
    {
        public async Task CompanyTypeAdded(CompanyType item)
        {
            await Clients.All.CompanyTypeAdded(item);
        }
        public async Task CompanyTypeUpdated(CompanyType item)
        {
            await Clients.All.CompanyTypeUpdated(item);
        }
        public async Task CompanyTypeDeleted(Guid id)
        {
            await Clients.All.CompanyTypeDeleted(id);
        }
    }
}