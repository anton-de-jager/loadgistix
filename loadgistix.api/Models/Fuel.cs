using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace loadgistix.api.Models
{
    public partial class Fuel
    {
        public Guid? Id { get; set; }
        public string? UserId { get; set; }
        public Guid? LoadId { get; set; }
        public Guid? VehicleId { get; set; }
        public Guid? DriverId { get; set; }
        public double? AddressLat { get; set; }
        public double? AddressLon { get; set; }
        public string? AddressLabel { get; set; }
        public float? Odo { get; set; }
        public float? Cost { get; set; }
        public DateTime? CreatedOn { get; set; }
    }
}
