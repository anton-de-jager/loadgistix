using loadgistix.api.Models;

namespace loadgistix.api.Interfaces
{
    public interface IUserHubClient
    {
        Task UserAdded(User item);
        Task UserUpdated(User item);
        Task UserDeleted(Guid id);
    }

}
