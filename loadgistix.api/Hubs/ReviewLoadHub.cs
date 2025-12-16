using loadgistix.api.Hubs;
using loadgistix.api.Interfaces;
using loadgistix.api.Models;
using Microsoft.AspNetCore.SignalR;

namespace loadgistix.api.Hubs
{
    public class ReviewLoadHub : Hub<IReviewLoadHubClient>
    {
        public async Task ReviewLoadAdded(ReviewLoad reviewLoad)
        {
            await Clients.All.ReviewLoadAdded(reviewLoad);
        }
    }
}