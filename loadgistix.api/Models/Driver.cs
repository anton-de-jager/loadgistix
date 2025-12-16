using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace loadgistix.api.Models
{
    public partial class Driver
    {
        public Guid? Id { get; set; }
        public string? UserId { get; set; }
        public string? UserDescription { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? IdNumber { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public Guid? LicenceTypeId { get; set; }
        public string? LicenceTypeDescription { get; set; }
        public string? LicenceTypeCode { get; set; }
        public DateTime? LicenceExpiryDate { get; set; }
        public DateTime? PdpExpiryDate { get; set; }
        public string? Avatar { get; set; }
        public string? AvatarPdp { get; set; }
        public string? Status { get; set; }
        public string? PdpId { get; set; }
    }
}
