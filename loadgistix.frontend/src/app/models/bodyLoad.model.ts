import { Guid } from "guid-typescript";

export class bodyLoad {
    id: Guid;
    description?: string;
    liquid?: boolean;
    height?: number;
    kilograms?: number;
    litres?: number;
    volume?: number;
}
