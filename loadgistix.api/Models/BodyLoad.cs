using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace loadgistix.api.Models
{
    public partial class BodyLoad
    {
        public Guid? Id { get; set; }
        public string? Description { get; set; }
        public int? Height { get; set; }
        public int? Kilograms { get; set; }
        public int? Volume { get; set; }
        public int? Litres { get; set; }
        public bool? Liquid { get; set; }
    }
}
