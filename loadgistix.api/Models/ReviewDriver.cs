using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace loadgistix.api.Models
{
    public partial class ReviewDriver
    {
        public Guid? Id { get; set; }
        public string? UserId { get; set; }
        public Guid? DriverId { get; set; }
        public Guid? LoadId { get; set; }
        public Guid? LoadDestinationId { get; set; }
        public int? RatingPunctuality { get; set; }
        public int? RatingVehicleDescription { get; set; }
        public int? RatingCare { get; set; }
        public int? RatingCondition { get; set; }
        public int? RatingAttitude { get; set; }
        public string? Note { get; set; }
        public DateTime? Timestamp { get; set; }
    }
}
