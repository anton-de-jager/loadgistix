using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace loadgistix.api.Models
{
    public partial class Vehicle
    {
        public Guid? Id { get; set; }
        public string? UserId { get; set; }
        public string? UserDescription { get; set; }
        public Guid? BranchId { get; set; }
        public string? BranchDescription { get; set; }
        public string? VehicleId { get; set; }
        public Guid? VehicleCategoryId { get; set; }
        public string? VehicleCategoryDescription { get; set; }
        public Guid? VehicleTypeId { get; set; }
        public string? VehicleTypeDescription { get; set; }
        public Guid? MakeId { get; set; }
        public string? MakeDescription { get; set; }
        public Guid? ModelId { get; set; }
        public string? ModelDescription { get; set; }
        public Guid? BodyTypeId { get; set; }
        public string? BodyTypeDescription { get; set; }
        public Guid? BodyLoadId { get; set; }
        public string? BodyLoadDescription { get; set; }
        public bool? Liquid { get; set; }
        public string? Description { get; set; }
        public string? RegistrationNumber { get; set; }
        public int? MaxLoadWeight { get; set; }
        public int? MaxLoadHeight { get; set; }
        public int? MaxLoadWidth { get; set; }
        public int? MaxLoadLength { get; set; }
        public int? MaxLoadVolume { get; set; }
        public int? AvailableCapacity { get; set; }
        public DateTime? AvailableFrom { get; set; }
        public DateTime? AvailableTo { get; set; }
        public string? OriginatingAddressLabel { get; set; }
        public double? OriginatingAddressLat { get; set; }
        public double? OriginatingAddressLon { get; set; }
        public string? DestinationAddressLabel { get; set; }
        public double? DestinationAddressLat { get; set; }
        public double? DestinationAddressLon { get; set; }
        public string? Avatar { get; set; }
        public string? Status { get; set; }
        public DateTime? CreatedOn { get; set; }
    }
}
