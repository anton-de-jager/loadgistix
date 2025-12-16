using loadgistix.api.Models;

namespace loadgistix.api.Interfaces
{
    public interface IBranchHubClient
    {
        Task BranchAdded(Branch item);
        Task BranchUpdated(Branch item);
        Task BranchDeleted(Guid id);
    }

}
