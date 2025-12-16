using loadgistix.api.Models;

namespace loadgistix.api.Interfaces
{
    public interface IDirectoryCategoryHubClient
    {
        Task DirectoryCategoryAdded(DirectoryCategory directoryCategory);
        Task DirectoryCategoryUpdated(DirectoryCategory directoryCategory);
        Task DirectoryCategoryDeleted(Guid id);
    }

}
