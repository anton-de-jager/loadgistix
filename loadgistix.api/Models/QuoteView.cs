using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace loadgistix.api.Models
{
    public partial class QuoteView
    {
        public Guid? Id { get; set; }
        public string? NameFirst { get; set; }
        public string? NameLast { get; set; }
        public string? Email { get; set; }
        public string? MobileNumber { get; set; }
        public string? Company { get; set; }
        public Guid? BusinessDescriptionId { get; set; }
        public string? BusinessDescription { get; set; }
        public Guid? OwnedRentedId { get; set; }
        public string? OwnedRentedDescription { get; set; }
        public double? Premium { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string? Status { get; set; }
    }
}
