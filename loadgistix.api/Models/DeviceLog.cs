using System;

namespace loadgistix.api.Models
{
    public partial class DeviceLog
    {
        public Guid Id { get; set; }
        public string? DeviceId { get; set; }
        public string? UserId { get; set; }
        public string? Platform { get; set; }
        public double? Lat { get; set; }
        public double? Lon { get; set; }
        public DateTime? LogDate { get; set; }
    }
}

