using loadgistix.api.Models;

namespace loadgistix.api.Interfaces
{
    public interface ICompanyTypeHubClient
    {
        Task CompanyTypeAdded(CompanyType item);
        Task CompanyTypeUpdated(CompanyType item);
        Task CompanyTypeDeleted(Guid id);
    }

}
