using System.ComponentModel.DataAnnotations;

namespace loadgistix.api.Auth
{
    public class RegisterModel
    {
        [Required(ErrorMessage = "Full Name is required")]
        public string? Name { get; set; }

        [EmailAddress]
        [Required(ErrorMessage = "Email is required")]
        public string? Email { get; set; }

        [Required(ErrorMessage = "Password is required")]
        public string? Password { get; set; }
    
        [Required(ErrorMessage = "Company is required")]
        public string? Company { get; set; }
    }
}
