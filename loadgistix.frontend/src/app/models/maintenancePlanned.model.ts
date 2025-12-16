import { Guid } from "guid-typescript";

export class maintenancePlanned {
    id: Guid;
    userId: string;
    vehicleId: Guid;
    maintenancePlannedTypeId: Guid;
    odo: number;
    cost: number;
    createdOn?: Date;
}
