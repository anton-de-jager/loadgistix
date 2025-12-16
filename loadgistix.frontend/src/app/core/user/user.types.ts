import { Guid } from "guid-typescript";

export interface User
{
    id: string;
    name: string;
    company: string;
    email: string;
    avatar?: string;
    status?: string;
    token?: string;
    resetToken?: Guid;
    phoneNumber?: string;
    emailConfirmed?: boolean;
    deviceId?: string;
    lastLoggedIn?: Date;
}
