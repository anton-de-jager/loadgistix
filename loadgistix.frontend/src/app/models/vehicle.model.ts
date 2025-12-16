import { Guid } from "guid-typescript";

export class vehicle {
    id: Guid;
    userId?: string;
    userDescription?: string;
    vehicleCategoryId?: Guid;
    vehicleCategoryDescription?: string;
    vehicleTypeId?: Guid;
    vehicleTypeDescription?: string;
    vehicleId?: string;
    description?: string;
    registrationNumber?: string;
    maxLoadWeight?: number;
    maxLoadHeight?: number;
    maxLoadWidth?: number;
    maxLoadLength?: number;
    maxLoadVolume?: number;
    availableCapacity?: number;
    availableFrom?: Date;
    availableTo?: Date;
    originatingAddressLabel?: string;
    originatingAddressLat?: number;
    originatingAddressLon?: number;
    // originatingCoordinates?: turf.Point;
    // originatingAddress?: string;
    destinationAddressLabel?: string;
    destinationAddressLat?: number;
    destinationAddressLon?: number;
    // destinationCoordinates?: turf.Point;
    // destinationAddress?: string;
    avatar?: string;
    status?: string;
    createdOn?: Date;
}
