import { Guid } from "guid-typescript";

export class pdp {
    id: Guid;
    pdpGroupId: Guid;
    pdpGroupDescription: string;
    description?: string;
}
