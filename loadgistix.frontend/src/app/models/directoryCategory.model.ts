import { Guid } from "guid-typescript";

export class directoryCategory {
    constructor(
        id: Guid,
        description: string,
        changedOn: Date,
        directoryCount: number
    ) {
        this.id = id;
        this.description = description;
        this.changedOn = changedOn;
        this.directoryCount = directoryCount;
    }
    public id: Guid;
    public description: string;
    public changedOn: Date;
    public directoryCount: number;
}