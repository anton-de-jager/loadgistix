using loadgistix.api.Models;

namespace loadgistix.api.Interfaces
{
    public interface IAxelHubClient
    {
        Task AxelAdded(Axel item);
        Task AxelUpdated(Axel item);
        Task AxelDeleted(Guid id);
    }

}
