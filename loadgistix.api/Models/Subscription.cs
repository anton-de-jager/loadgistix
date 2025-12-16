using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace loadgistix.api.Models
{
    public partial class Subscription
    {
        public Guid? Id { get; set; }
        public string? UserId { get; set; }
        public string? Reference { get; set; }
        public decimal? Amount_gross { get; set; }
        public decimal? Amount_net { get; set; }
        public decimal? Amount_fee { get; set; }
        public DateTime? DateStart { get; set; }
        public bool? Active { get; set; }
    }
}
