using loadgistix.api.Models;

namespace loadgistix.api.Interfaces
{
    public interface IReviewDriverHubClient
    {
        Task ReviewDriverAdded(ReviewDriver reviewDriver);
    }

}
