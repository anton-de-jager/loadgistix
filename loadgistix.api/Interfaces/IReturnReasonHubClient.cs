using loadgistix.api.Models;

namespace loadgistix.api.Interfaces
{
    public interface IReturnReasonHubClient
    {
        Task ReturnReasonAdded(ReturnReason item);
        Task ReturnReasonUpdated(ReturnReason item);
        Task ReturnReasonDeleted(Guid id);
    }

}
