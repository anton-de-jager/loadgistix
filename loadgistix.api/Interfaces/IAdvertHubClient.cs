using loadgistix.api.Models;

namespace loadgistix.api.Interfaces
{
    public interface IAdvertHubClient
    {
        Task AdvertAdded(Advert item);
        Task AdvertUpdated(Advert item);
        Task AdvertDeleted(Guid id);
    }

}
