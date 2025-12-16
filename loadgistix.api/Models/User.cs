using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace loadgistix.api.Models
{
    public partial class User
    {
        public Guid? Id { get; set; }
        public string? Name { get; set; }
        public string? Company { get; set; }
        public string? Avatar { get; set; }
        public string? Status { get; set; }
        public Guid? ResetToken { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }
        public bool EmailConfirmed { get; set; }
        public string? PasswordHash { get; set; }
        public string? DeviceId { get; set; }
        public string? Token { get; set; }
        public DateTime LastLoggedIn { get; set; }

        //public string? Uid { get; set; }
        //public string? Description { get; set; }
        //public string? Email { get; set; }
        //public string? DeviceId { get; set; }
        //public string? Token { get; set; }
    }
}
