using loadgistix.api.Models;

namespace loadgistix.api.Interfaces
{
    public interface IDriverHubClient
    {
        Task DriverAdded(Driver item);
        Task DriverUpdated(Driver item);
        Task DriverDeleted(Guid id);
    }

}
