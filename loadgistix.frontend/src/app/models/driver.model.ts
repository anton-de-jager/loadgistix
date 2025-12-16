import { Guid } from "guid-typescript";

export class driver {
    id: Guid;
    userId?: string;
    userDescription?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    password?: string;
    idNumber?: string;
    dateOfBirth?: Date;
    licenceTypeId?: Guid;
    licenceTypeDescription?: string;
    licenceTypeCode?: string;
    licenceExpiryDate?: Date;
    pdpId?: string;
    pdpExpiryDate?: Date;
    avatar?: string;
    avatarPdp?: string;
    status?: string;
}
