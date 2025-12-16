using loadgistix.api.Models;

namespace loadgistix.api.Interfaces
{
    public interface IDirectoryHubClient
    {
        Task DirectoryAdded(Models.Directory directory);
        Task DirectoryUpdated(Models.Directory directory);
        Task DirectoryDeleted(Guid id);
    }

}
