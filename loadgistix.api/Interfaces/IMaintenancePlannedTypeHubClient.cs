using loadgistix.api.Models;

namespace loadgistix.api.Interfaces
{
    public interface IMaintenancePlannedTypeHubClient
    {
        Task MaintenancePlannedTypeAdded(MaintenancePlannedType item);
        Task MaintenancePlannedTypeUpdated(MaintenancePlannedType item);
        Task MaintenancePlannedTypeDeleted(Guid id);
    }

}
