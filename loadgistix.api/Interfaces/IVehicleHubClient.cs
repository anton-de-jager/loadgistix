using loadgistix.api.Models;

namespace loadgistix.api.Interfaces
{
    public interface IVehicleHubClient
    {
        Task VehicleAdded(Vehicle vehicle);
        Task VehicleUpdated(Vehicle vehicle);
        Task VehicleDeleted(Guid id);
    }

}
