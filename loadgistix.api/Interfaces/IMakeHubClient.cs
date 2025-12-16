using loadgistix.api.Models;

namespace loadgistix.api.Interfaces
{
    public interface IMakeHubClient
    {
        Task MakeAdded(Make item);
        Task MakeUpdated(Make item);
        Task MakeDeleted(Guid id);
    }

}
