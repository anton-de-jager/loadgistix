using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace loadgistix.api.Interfaces
{
    public interface IUserService
    {
        string GetCurrentUserId();
        string GetCurrentUserEmail();
        // Add other methods for retrieving user information as needed
    }

    public class UserService : IUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public string GetCurrentUserId()
        {
            return _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        }

        public string GetCurrentUserEmail()
        {
            return _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Email);
        }

        public string GetCurrentUserName()
        {
            return _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);
        }

        // Implement other methods for retrieving user information as needed
    }
}
