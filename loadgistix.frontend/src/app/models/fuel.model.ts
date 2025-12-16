import { Guid } from "guid-typescript";

export class fuel {
    id: Guid;
    userId?: Guid;
    loadId?: Guid;
    vehicleId?: Guid;
    driverId?: Guid;
    addressLabel?: string;
    addressLat?: number;
    addressLon?: number;
    odo?: number;
    cost?: number;
    createdOn?: Date;
}
