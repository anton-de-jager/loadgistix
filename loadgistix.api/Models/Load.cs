using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace loadgistix.api.Models
{
    public partial class Load
    {
        public Guid? Id { get; set; }
        public string? UserId { get; set; }
        public string? UserDescription { get; set; }
        public Guid? LoadTypeId { get; set; }
        public string? LoadTypeDescription { get; set; }
        public bool? Liquid { get; set; }
        public string? Description { get; set; }
        public string? Note { get; set; }
        public double? Price { get; set; }
        public int? ItemCount { get; set; }
        public double? Weight { get; set; }
        public double? Length { get; set; }
        public double? Width { get; set; }
        public double? Height { get; set; }
        public double? Volume { get; set; }
        public double? TotalValue { get; set; }
        public DateTime? DateOut { get; set; }
        public DateTime? DateIn { get; set; }
        public DateTime? DateBidEnd { get; set; }
        public double? FridgeHours { get; set; }
        public double? KgsLoaded { get; set; }
        public string? CustomerLoadedForm { get; set; }
        public double? ReviewAverageLoad { get; set; }
        public int? ReviewCountLoad { get; set; }
        public int? BidCount { get; set; }
        public Guid? LoadDestinationId { get; set; }
        public string? OriginatingAddressLabel { get; set; }
        public double? OriginatingAddressLat { get; set; }
        public double? OriginatingAddressLon { get; set; }
        public string? DestinationAddressLabel { get; set; }
        public double? DestinationAddressLat { get; set; }
        public double? DestinationAddressLon { get; set; }
        public string? Route { get; set; }
        public double? Meters { get; set; }
        public double? Minutes { get; set; }
        public double? OdoStart { get; set; }
        public double? OdoEnd { get; set; }
        public string? DeliveryNoteNumber { get; set; }
        public string? WeighBridgeTicketNumber { get; set; }
        public string? ReturnDocumentNumber { get; set; }
        public double? ReturnKgs { get; set; }
        public int? ReturnPallets { get; set; }
        public Guid? ReturnReasonId { get; set; }
        public Guid? StockProblemId { get; set; }
        public int? DestinationCount { get; set; }
        public int? DestinationDelivered { get; set; }
        public DateTime? CreatedOn { get; set; }
        public DateTime? ChangedOn { get; set; }
        public string? Status { get; set; }
    }
}
