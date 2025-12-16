using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace loadgistix.api.Models
{
    public partial class LoadDestination
    {
        public Guid? Id { get; set; }
        public string? UserId { get; set; }
        public Guid? LoadId { get; set; }
        public int? Pos { get; set; }
        public string? OriginatingAddressLabel { get; set; }
        public double? OriginatingAddressLat { get; set; }
        public double? OriginatingAddressLon { get; set; }
        public string? DestinationAddressLabel { get; set; }
        public double? DestinationAddressLat { get; set; }
        public double? DestinationAddressLon { get; set; }
        public double? OdoStart { get; set; }
        public double? OdoEnd { get; set; }
        public string? DeliveryNoteNumber { get; set; }
        public string? WeighBridgeTicketNumber { get; set; }
        public string? ReturnDocumentNumber { get; set; }
        public double? ReturnKgs { get; set; }
        public Guid? ReturnReasonId { get; set; }
        public Guid? StockProblemId { get; set; }
        public int? ReturnPallets { get; set; }
        public string? UserIdLoaded { get; set; }
        public string? UserIdLoadedConfirmed { get; set; }
        public string? UserIdDelivered { get; set; }
        public string? UserIdDeliveredConfirmed { get; set; }
        public DateTime? CreatedOn { get; set; }
        public DateTime? ChangedOn { get; set; }
        public string? Status { get; set; }
    }
}
