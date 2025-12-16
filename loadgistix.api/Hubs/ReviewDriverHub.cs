using loadgistix.api.Hubs;
using loadgistix.api.Interfaces;
using loadgistix.api.Models;
using Microsoft.AspNetCore.SignalR;

namespace loadgistix.api.Hubs
{
    public class ReviewDriverHub : Hub<IReviewDriverHubClient>
    {
        public async Task ReviewDriverAdded(ReviewDriver reviewDriver)
        {
            await Clients.All.ReviewDriverAdded(reviewDriver);
        }
    }
}