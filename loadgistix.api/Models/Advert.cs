using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace loadgistix.api.Models
{
    public partial class Advert
    {
        public Guid? Id { get; set; }
        public string? UserId { get; set; }
        public string? UserDescription { get; set; }
        public string? Title { get; set; }
        public string? SubTitle { get; set; }
        public string? Content { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? Website { get; set; }
        public string? AddressLabel { get; set; }
        public double? AddressLat { get; set; }
        public double? AddressLon { get; set; }
        public DateTime? ChangedOn { get; set; }
        public string? Status { get; set; }
        public string? Avatar { get; set; }
        public DateTime? CreatedOn { get; set; }
    }
}
