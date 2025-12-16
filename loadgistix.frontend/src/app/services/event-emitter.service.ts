import { Injectable, EventEmitter } from '@angular/core';
import { User } from 'app/core/user/user.types';

@Injectable({
    providedIn: 'root'
})
export class EventEmitterService {

    invokeChangeUserFunction = new EventEmitter();
    invokeChangePageFunction = new EventEmitter();
    invokeButtonClickFunction = new EventEmitter();
    invokeChangeLocationFunction = new EventEmitter();

    constructor() { }

    onChangeUser(user: User) {
        this.invokeChangeUserFunction.emit(user);
    }

    onChangePage(page: string) {
        this.invokeChangePageFunction.emit(page);
    }

    onButtonClick(id: string) {
        this.invokeButtonClickFunction.emit(id);
    }

    onChangeLocation(location: any) {
        this.invokeChangeLocationFunction.emit(location);
    }
}
