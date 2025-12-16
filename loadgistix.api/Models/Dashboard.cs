using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace loadgistix.api.Models
{
    public partial class Dashboard
    {
        public int? LoadCountTotal { get; set; }
        public int? LoadCountNew { get; set; }
        public int? VehicleCountTotal { get; set; }
        public int? VehicleCountNew { get; set; }
        public int? AdvertCountTotal { get; set; }
        public int? AdvertCountNew { get; set; }
        public int? DirectoryCountTotal { get; set; }
        public int? DirectoryCountNew { get; set; }
        public int? UserCountLoadTotal { get; set; }
        public int? UserCountLoadNew { get; set; }
        public int? UserCountVehicleTotal { get; set; }
        public int? UserCountVehicleNew { get; set; }
    }
}
