using System.ComponentModel.DataAnnotations;

namespace loadgistix.api.Auth
{
    public class ResetPasswordModel
    {

        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Token is required")]
        public string Token { get; set; }
    }
}
