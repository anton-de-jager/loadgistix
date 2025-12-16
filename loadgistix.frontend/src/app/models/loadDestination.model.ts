import { Guid } from "guid-typescript";

export class loadDestination {
    id?: Guid;
    userId?: string;
    loadId?: Guid;
    pos?: number;
    originatingAddressLabel?: string;
    originatingAddressLat?: number;
    originatingAddressLon?: number;
    destinationAddressLabel?: string;
    destinationAddressLat?: number;
    destinationAddressLon?: number;
    odoStart?: number;
    odoEnd?: number;
    deliveryNoteNumber?: string;
    weighBridgeTicketNumber?: string;
    returnDocumentNumber?: string;
    returnKgs?: number;
    returnReasonId?: Guid;
    stockProblemId?: Guid;
    returnPallets?: number;
    userIdLoaded?: string;
    userIdLoadedConfirmed?: string;
    userIdDelivered?: string;
    userIdDeliveredConfirmed?: string;
    createdOn?: Date;
    changedOn?: Date;
    status?: string;
}
