using Microsoft.AspNetCore.Identity;

namespace loadgistix.api.Auth
{
    public class ApplicationUser : IdentityUser
    {
        public string Name { get; set; }
        public string Company { get; set; }
        public string Avatar { get; set; }
        public string Status { get; set; }
        public string ResetToken { get; set; }
    }
}
