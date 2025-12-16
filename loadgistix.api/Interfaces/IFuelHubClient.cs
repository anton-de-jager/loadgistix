using loadgistix.api.Models;

namespace loadgistix.api.Interfaces
{
    public interface IFuelHubClient
    {
        Task FuelAdded(Fuel item);
        Task FuelUpdated(Fuel item);
        Task FuelDeleted(Guid id);
    }

}
