using loadgistix.api.Models;

namespace loadgistix.api.Interfaces
{
    public interface IVehicleCategoryHubClient
    {
        Task VehicleCategoryAdded(VehicleCategory item);
        Task VehicleCategoryUpdated(VehicleCategory item);
        Task VehicleCategoryDeleted(Guid id);
    }

}
