import { Guid } from "guid-typescript";

export class branch {
    id: Guid;
    userId?: string;
    userDescription?: string;
    description?: string;
    addressLabel?: string;
    addressLat?: string;
    addressLon?: string;
    email?: string;
    phone?: string;
}
