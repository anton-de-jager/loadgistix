using loadgistix.api.Models;

namespace loadgistix.api.Interfaces
{
    public interface IVehicleTypeHubClient
    {
        Task VehicleTypeAdded(VehicleType item);
        Task VehicleTypeUpdated(VehicleType item);
        Task VehicleTypeDeleted(Guid id);
    }

}
