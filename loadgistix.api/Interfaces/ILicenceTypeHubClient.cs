using loadgistix.api.Models;

namespace loadgistix.api.Interfaces
{
    public interface ILicenceTypeHubClient
    {
        Task LicenceTypeAdded(LicenceType item);
        Task LicenceTypeUpdated(LicenceType item);
        Task LicenceTypeDeleted(Guid id);
    }

}
