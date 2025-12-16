using loadgistix.api.Models;

namespace loadgistix.api.Interfaces
{
    public interface IMaintenanceUnPlannedHubClient
    {
        Task MaintenanceUnPlannedAdded(MaintenanceUnPlanned item);
        Task MaintenanceUnPlannedUpdated(MaintenanceUnPlanned item);
        Task MaintenanceUnPlannedDeleted(Guid id);
    }

}
