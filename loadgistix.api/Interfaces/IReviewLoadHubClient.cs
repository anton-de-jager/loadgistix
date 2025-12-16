using loadgistix.api.Models;

namespace loadgistix.api.Interfaces
{
    public interface IReviewLoadHubClient
    {
        Task ReviewLoadAdded(ReviewLoad reviewLoad);
    }

}
