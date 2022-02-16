import { Component } from '@angular/core';
import { ApiService } from './modules/admin/services/api.service';
//import { MessageService } from './modules/admin/services/message.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    /**
     * Constructor
     */
    constructor(
        private apiService: ApiService
        //private messageService: MessageService
    ) {
        //localStorage.removeItem('accessToken');
        // this.apiService.signIn({ email: 'anton@madproducts.co.za', password: 'P@szw0rd' }).subscribe({
        //     next: (apiResult: any) => {
        //         console.log(apiResult);
        //         //localStorage.setItem('accessToken', apiResult.accessToken);
        //         this.apiService.get('user', '3fc24765-684d-4a2b-a4c3-e511a70cf40b').subscribe({
        //             next: (apiResult: any) => {
        //                 console.log(apiResult);

        //             },
        //             error: (error) => {
        //                 console.log(error);
        //             },
        //             complete: () => {
        //                 //console.log('Done');
        //             }
        //         });
        //     },
        //     error: (error) => {
        //         console.log(error);
        //     },
        //     complete: () => {
        //         //console.log('Done');
        //     }
        // });
        // messageService.messages.subscribe(msg => {
        //     console.log("Response from websocket: " + msg);
        //     // setTimeout(() => {
        //     //     this.sendMsg();
        //     // }, 1000);
        // });
    }

    // message = {
    //     author: "tutorialedge",
    //     message: "this is a test message"
    // };

    // sendMsg() {
    //     console.log("new message from client to websocket: ", this.message);
    //     this.messageService.messages.next(this.message);
    //     this.message.message = "";
    // }
}
