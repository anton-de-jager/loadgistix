import { Guid } from "guid-typescript";
import { vehicleCategory } from "./vehicleCategory.model";

export class vehicleType {
    id: Guid;
    vehicleCategoryId?: Guid;
    vehicleCategoryDescription?: string;
    description?: string;
    // liquid?: boolean;
}
