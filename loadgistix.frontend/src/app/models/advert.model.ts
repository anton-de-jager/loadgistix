import { Guid } from "guid-typescript";

export class advert {
    constructor(
        id: Guid,
        userId: string,
        userDescription: string,
        title: string,
        subTitle: string,
        content: string,
        phone: string,
        email: string,
        website: string,
        addressLabel: string,
        addressLat: string,
        addressLon: string,
        status: string,
        avatar: string,
        createdOn: Date
    ) {
        this.id = id;
        this.userId = userId;
        this.userDescription = userDescription;
        this.title = title;
        this.subTitle = subTitle;
        this.content = content;
        this.phone = phone;
        this.email = email;
        this.website = website;
        this.addressLabel = addressLabel;
        this.addressLat = addressLat;
        this.addressLon = addressLon;
        this.avatar = avatar;
        this.status = status;
        this.createdOn = createdOn;
    }
    public id: Guid;
    public userId: string;
    public userDescription: string;
    public title: string;
    public subTitle: string;
    public content: string;
    public phone: string;
    public email: string;
    public website: string;
    public addressLabel: string;
    public addressLat: string;
    public addressLon: string;
    public status: string;
    public avatar: string;
    public createdOn: Date;
}
