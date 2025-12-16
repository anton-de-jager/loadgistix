using System;

namespace loadgistix.api.Models
{
    public partial class PdpGroup
    {
        public Guid Id { get; set; }
        public string? Description { get; set; }
        public string? UserId { get; set; }
        public string? UserDescription { get; set; }
    }
}

