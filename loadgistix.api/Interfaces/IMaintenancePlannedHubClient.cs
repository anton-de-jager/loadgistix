using loadgistix.api.Models;

namespace loadgistix.api.Interfaces
{
    public interface IMaintenancePlannedHubClient
    {
        Task MaintenancePlannedAdded(MaintenancePlanned item);
        Task MaintenancePlannedUpdated(MaintenancePlanned item);
        Task MaintenancePlannedDeleted(Guid id);
    }

}
