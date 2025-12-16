import { Guid } from "guid-typescript";

export class reviewDriver {
    // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
    constructor(
        id: Guid,
        userId: string,
        driverId: Guid,
        loadId: Guid,
        loadDestinationId: Guid,
        ratingPunctuality: number,
        ratingVehicleDescription: number,
        ratingCare: number,
        ratingCondition: number,
        ratingAttitude: number,
        note: string,
        timestamp: Date
    ) {
        this.id = id;
        this.userId = userId;
        this.driverId = driverId;
        this.loadId = loadId;
        this.loadDestinationId = loadDestinationId;
        this.ratingPunctuality = ratingPunctuality;
        this.ratingVehicleDescription = ratingVehicleDescription;
        this.ratingCare = ratingCare;
        this.ratingCondition = ratingCondition;
        this.ratingAttitude = ratingAttitude;
        this.note = note;
        this.timestamp = timestamp;

    }

    public id: Guid;
    public userId: string;
    public loadId: Guid;
    public driverId: Guid;
    public loadDestinationId: Guid;
    public ratingPunctuality: number;
    public ratingVehicleDescription: number;
    public ratingCare: number;
    public ratingCondition: number;
    public ratingAttitude: number;
    public note: string;
    public timestamp: Date;
}
