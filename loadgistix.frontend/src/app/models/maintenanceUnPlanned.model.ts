import { Guid } from "guid-typescript";

export class maintenanceUnPlanned {
    id: Guid;
    userId: string;
    loadId: Guid;
    maintenanceUnPlannedTypeId: Guid;
    odo: number;
    cost: number;
    createdOn?: Date;
}
