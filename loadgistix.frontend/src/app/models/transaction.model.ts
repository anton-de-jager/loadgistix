import { Guid } from "guid-typescript";

export class transaction {
    id: Guid;
    userId?: Guid;
    subscriptionId?: Guid;
    advert?: number;
    tms?: number;
    directory?: number;
    vehicle?: number;
    load?: number;
    amount_gross?: number;
    amount_net?: number;
    amount_fee?: number;
    dateBilling?: Date;
    changedOn?: Date;
    createdOn?: Date;
}
