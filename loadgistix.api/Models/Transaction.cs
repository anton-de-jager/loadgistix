using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace loadgistix.api.Models
{
    public partial class Transaction
    {
        public Guid? Id { get; set; }
        public string? UserId { get; set; }
        public Guid? SubscriptionId { get; set; }
        public int? Advert { get; set; }
        public int? Tms { get; set; }
        public int? Directory { get; set; }
        public int? Vehicle { get; set; }
        public int? Load { get; set; }
        public decimal? Amount_gross { get; set; }
        public decimal? Amount_net { get; set; }
        public decimal? Amount_fee { get; set; }
        public DateTime? DateBilling { get; set; }
        public DateTime? CreatedOn { get; set; }
    }
}
