using loadgistix.api.Models;

namespace loadgistix.api.Interfaces
{
    public interface IBidHubClient
    {
        Task BidAdded(Bid bid);
        Task BidUpdated(Bid bid);
        Task BidDeleted(Guid id);
    }

}
