using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace loadgistix.api.Models
{
    public partial class LoadUpdate
    {
        public Load? Load { get; set; }
        public LoadDestination[]? LoadDestination { get; set; }
    }
}
