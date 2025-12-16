using loadgistix.api.Models;

namespace loadgistix.api.Interfaces
{
    public interface IModelHubClient
    {
        Task ModelAdded(Model item);
        Task ModelUpdated(Model item);
        Task ModelDeleted(Guid id);
    }

}
