using System.ComponentModel.DataAnnotations;

namespace loadgistix.api.Auth
{
    public class RefreshTokenModel
    {
        [Required(ErrorMessage = "AccessToken is required")]
        public string? AccessToken { get; set; }
    }
}
