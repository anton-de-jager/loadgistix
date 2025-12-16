using loadgistix.api.Models;

namespace loadgistix.api.Interfaces
{
    public interface IPdpHubClient
    {
        Task PdpAdded(Pdp item);
        Task PdpUpdated(Pdp item);
        Task PdpDeleted(Guid id);
    }

}
