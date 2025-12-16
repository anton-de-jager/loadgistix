using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace loadgistix.api.Models
{
    public partial class AdvertLog
    {
        public Guid Id { get; set; }
        public Guid? AdvertId { get; set; }
        public DateTime? AdvertDate { get; set; }
        public int? AdvertCount { get; set; }
    }
}
