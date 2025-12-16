import { Guid } from "guid-typescript";
import { make } from "./make.model";

export class model {
    id: Guid;
    makeId?: Guid;
    makeDescription?: string;
    description?: string;
}
