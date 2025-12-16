using loadgistix.api.Models;

namespace loadgistix.api.Interfaces
{
    public interface ILoadDestinationHubClient
    {
        Task LoadDestinationAdded(LoadDestination loadDestination);
        Task LoadDestinationUpdated(LoadDestination loadDestination);
        Task LoadDestinationDeleted(Guid id);
    }

}
