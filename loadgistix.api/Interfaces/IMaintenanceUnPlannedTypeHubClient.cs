using loadgistix.api.Models;

namespace loadgistix.api.Interfaces
{
    public interface IMaintenanceUnPlannedTypeHubClient
    {
        Task MaintenanceUnPlannedTypeAdded(MaintenanceUnPlannedType item);
        Task MaintenanceUnPlannedTypeUpdated(MaintenanceUnPlannedType item);
        Task MaintenanceUnPlannedTypeDeleted(Guid id);
    }

}
