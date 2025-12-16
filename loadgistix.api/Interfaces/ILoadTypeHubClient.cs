using loadgistix.api.Models;

namespace loadgistix.api.Interfaces
{
    public interface ILoadTypeHubClient
    {
        Task LoadTypeAdded(LoadType item);
        Task LoadTypeUpdated(LoadType item);
        Task LoadTypeDeleted(Guid id);
    }

}
