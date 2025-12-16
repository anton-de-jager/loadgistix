using loadgistix.api.Models;

namespace loadgistix.api.Interfaces
{
    public interface ILoadHubClient
    {
        Task LoadAdded(Load load);
        Task LoadUpdated(Load load);
        Task LoadDeleted(Guid id);
    }

}
