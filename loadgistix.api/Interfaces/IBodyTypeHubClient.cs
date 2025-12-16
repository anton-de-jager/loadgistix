using loadgistix.api.Models;

namespace loadgistix.api.Interfaces
{
    public interface IBodyTypeHubClient
    {
        Task BodyTypeAdded(BodyType item);
        Task BodyTypeUpdated(BodyType item);
        Task BodyTypeDeleted(Guid id);
    }

}
