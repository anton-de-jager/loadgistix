using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace loadgistix.api.Models
{
    public partial class DirectoryLog
    {
        public Guid Id { get; set; }
        public Guid? DirectoryId { get; set; }
        public DateTime? DirectoryDate { get; set; }
        public int? DirectoryCount { get; set; }
    }
}
