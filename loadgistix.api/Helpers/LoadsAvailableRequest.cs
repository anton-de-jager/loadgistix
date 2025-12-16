using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace loadgistix.api.Models
{
    public partial class LoadsAvailableRequest
    {
        public string? UserId { get; set; }
        public int? Distance { get; set; }
        public bool? Origin { get; set; }
        public bool? Destination { get; set; }
        public string? Input { get; set; }
        public float? Lat { get; set; }
        public float? Lon { get; set; }
        public float? Weight { get; set; }
        public float? VolumeCm { get; set; }
        public float? VolumeLt { get; set; }
    }
}
