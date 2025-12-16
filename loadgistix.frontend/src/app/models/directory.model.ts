import { Guid } from "guid-typescript";

export class directory {
    id: Guid;
    userId?: string;
    userDescription?: string;
    directoryCategoryId?: Guid;
    directoryCategoryDescription?: string;
    companyName?: string;
    description?: string;
    email?: string;
    phone?: string;
    website?: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
    addressLat?: number;
    addressLon?: number;
    addressLabel?: string;
    avatar?: string;
    status?: string;
    count?: number;
    createdOn?: Date;
}
