using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace loadgistix.api.Models
{
    public partial class QuoteTruck
    {
        public Guid? Id { get; set; }
        public Guid? QuoteId { get; set; }
        public string? Make { get; set; }
        public string? Model { get; set; }
        public int? Year { get; set; }
        public int? Value { get; set; }
        public DateTime? CreatedOn { get; set; }
    }
}
