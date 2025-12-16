using loadgistix.api.Models;

namespace loadgistix.api.Interfaces
{
    public interface IBodyLoadHubClient
    {
        Task BodyLoadAdded(BodyLoad item);
        Task BodyLoadUpdated(BodyLoad item);
        Task BodyLoadDeleted(Guid id);
    }

}
