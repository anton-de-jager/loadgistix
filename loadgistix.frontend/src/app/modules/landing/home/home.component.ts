import { AfterViewInit, Component, NgZone, OnDestroy, inject, Inject, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { Capacitor, Plugins, registerWebPlugin } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { NgClass, NgIf } from '@angular/common';
import { Subject } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { environment } from 'environments/environment';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'app/core/auth/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { SqlService } from 'app/services/sql.service';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { AdvertHorizontalComponent } from 'app/layout/common/advertHorizontal/advertHorizontal.component';
import { DialogQuoteComponent } from 'app/dialogs/dialog-quote/dialog-quote.component';
import { extractApiData } from 'app/services/api-response.helper';

declare let google: any;
@Component({
    selector: 'landing-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [NgClass, NgIf, MatButtonModule, MatIconModule, MatToolbarModule, MatMenuModule, MatButtonToggleModule, NgApexchartsModule, AdvertHorizontalComponent, RouterLink]
})
export class LandingHomeComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('targetElement') targetElement: ElementRef;
    private _unsubscribeAll = new Subject<void>();
    user = null;
    token = null;

    loading!: boolean;
    public iBanner: number = 1;
    public _bannerText: string = 'make some noise';//'Welcome to LOADGISTIX';
    public _2bannerText1: string = 'Connecting';
    public _2bannerText2: string = 'YOU';
    public _3bannerText1: string = 'turn';
    public _3bannerText2: string = 'some';
    public _3bannerText3: string = 'heads';
    public _6bannerText1: string = 'Discover';
    public _6bannerText2: string = 'The';
    public _6bannerText3: string = 'Secret';
    public _6bannerText4: string = 'Society';
    public _6bannerText5: string = 'of';
    public _6bannerText6: string = 'Logistics';
    // public gcid = environment.googleClientId;

    chartGithubIssues: ApexOptions = {};
    chartTaskDistribution: ApexOptions = {};
    data: any;

    currentUser: User;

    loadCountTotal: number = 0;
    loadCountNew: number = 0;
    vehicleCountTotal: number = 0;
    vehicleCountNew: number = 0;
    advertCountTotal: number = 0;
    advertCountNew: number = 0;
    directoryCountTotal: number = 0;
    directoryCountNew: number = 0;
    userCountLoadTotal: number = 0;
    userCountLoadNew: number = 0;
    userCountVehicleTotal: number = 0;
    userCountVehicleNew: number = 0;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private sqlService: SqlService,
        private ngZone: NgZone,
        private http: HttpClient,
        private authService: AuthService,
        private userService: UserService,
        @Inject(MatDialog) private dialog: MatDialog
    ) {
        document.cookie = 'g_state' + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        this._prepareChartData();
        this.userService.user$.subscribe(user => {
            if (user) {
                this.currentUser = user;
            }
        });
    }

    ngOnInit() {
        // this.$user = this.currentUser;
    }

    private _prepareChartData(): void {
        this.sqlService.createItem('dashboards', { UserId: this.currentUser ? this.currentUser.id : '00000000-0000-0000-0000-000000000000' }).subscribe((result) => {
            const data = extractApiData(result?.data);
            if (data) {
                this.loadCountTotal = data.loadCountTotal ?? 0;
                this.loadCountNew = data.loadCountNew ?? 0;
                this.vehicleCountTotal = data.vehicleCountTotal ?? 0;
                this.vehicleCountNew = data.vehicleCountNew ?? 0;
                this.advertCountTotal = data.advertCountTotal ?? 0;
                this.advertCountNew = data.advertCountNew ?? 0;
                this.directoryCountTotal = data.directoryCountTotal ?? 0;
                this.directoryCountNew = data.directoryCountNew ?? 0;
                this.userCountLoadTotal = data.userCountLoadTotal ?? 0;
                this.userCountLoadNew = data.userCountLoadNew ?? 0;
                this.userCountVehicleTotal = data.userCountVehicleTotal ?? 0;
                this.userCountVehicleNew = data.userCountVehicleNew ?? 0;
            }
        });
        // // Github issues
        // this.chartGithubIssues = {
        //     chart: {
        //         fontFamily: 'inherit',
        //         foreColor: 'inherit',
        //         height: '100%',
        //         type: 'line',
        //         toolbar: {
        //             show: false,
        //         },
        //         zoom: {
        //             enabled: false,
        //         },
        //     },
        //     colors: ['#64748B', '#94A3B8'],
        //     dataLabels: {
        //         enabled: true,
        //         enabledOnSeries: [0],
        //         background: {
        //             borderWidth: 0,
        //         },
        //     },
        //     grid: {
        //         borderColor: 'var(--fuse-border)',
        //     },
        //     labels: this.data.githubIssues.labels,
        //     legend: {
        //         show: false,
        //     },
        //     plotOptions: {
        //         bar: {
        //             columnWidth: '50%',
        //         },
        //     },
        //     series: this.data.githubIssues.series,
        //     states: {
        //         hover: {
        //             filter: {
        //                 type: 'darken',
        //                 value: 0.75,
        //             },
        //         },
        //     },
        //     stroke: {
        //         width: [3, 0],
        //     },
        //     tooltip: {
        //         followCursor: true,
        //         theme: 'dark',
        //     },
        //     xaxis: {
        //         axisBorder: {
        //             show: false,
        //         },
        //         axisTicks: {
        //             color: 'var(--fuse-border)',
        //         },
        //         labels: {
        //             style: {
        //                 colors: 'var(--fuse-text-secondary)',
        //             },
        //         },
        //         tooltip: {
        //             enabled: false,
        //         },
        //     },
        //     yaxis: {
        //         labels: {
        //             offsetX: -16,
        //             style: {
        //                 colors: 'var(--fuse-text-secondary)',
        //             },
        //         },
        //     },
        // };

        // // Task distribution
        // this.chartTaskDistribution = {
        //     chart: {
        //         fontFamily: 'inherit',
        //         foreColor: 'inherit',
        //         height: '100%',
        //         type: 'polarArea',
        //         toolbar: {
        //             show: false,
        //         },
        //         zoom: {
        //             enabled: false,
        //         },
        //     },
        //     labels: this.data.taskDistribution.labels,
        //     legend: {
        //         position: 'bottom',
        //     },
        //     plotOptions: {
        //         polarArea: {
        //             spokes: {
        //                 connectorColors: 'var(--fuse-border)',
        //             },
        //             rings: {
        //                 strokeColor: 'var(--fuse-border)',
        //             },
        //         },
        //     },
        //     series: this.data.taskDistribution.series,
        //     states: {
        //         hover: {
        //             filter: {
        //                 type: 'darken',
        //                 value: 0.75,
        //             },
        //         },
        //     },
        //     stroke: {
        //         width: 2,
        //     },
        //     theme: {
        //         monochrome: {
        //             enabled: true,
        //             color: '#93C5FD',
        //             shadeIntensity: 0.75,
        //             shadeTo: 'dark',
        //         },
        //     },
        //     tooltip: {
        //         followCursor: true,
        //         theme: 'dark',
        //     },
        //     yaxis: {
        //         labels: {
        //             style: {
        //                 colors: 'var(--fuse-text-secondary)',
        //             },
        //         },
        //     },
        // };
    }

    signIn() {
        try {
            this._router.navigateByUrl('/sign-in');
        } catch (exc) {
            console.log(exc);
        }
    }

    signUp() {
        try {
            this._router.navigateByUrl('/sign-up');
        } catch (exc) {
            console.log(exc);
        }
    }

    goTo(url:string) {
        if ((this.currentUser !== null && this.currentUser !== undefined) || url.indexOf('business-directory') >= 0) {
            this._router.navigateByUrl('/' + url);
        }else{
            this._router.navigateByUrl('/sign-in');
        }
    }

    scrollToElement(): void {
        document.getElementById('targetElement').scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest',
        });
    }

    async ngAfterViewInit() {
        setTimeout(() => {
            this.setBanner();
        }, 5000);

        // try {
        //     this.auth.onAuthStateChanged((user) => {
        //         if (!user) {
        //             // Ensure the google object exists
        //             //if (typeof google !== 'undefined') {
        //             this.loadGoogleLibrary().then(() => {
        //                 google.accounts.id.initialize({
        //                     client_id: environment.googleClientId,
        //                     callback: this.handleCredentialResponse.bind(this)
        //                 });

        //                 if (google.accounts) {
        //                     google.accounts.id.renderButton(
        //                         document.getElementById("g_id_onload"),
        //                         {
        //                             theme: "outline",
        //                             size: "large"
        //                         }
        //                     );

        //                     google.accounts.id.prompt();  // Prompt the One Tap dialog
        //                 }
        //             });
        //             //}
        //         }
        //     });
        // } catch (error) {
        //     console.log(error);
        // }
    }

    loadGoogleLibrary() {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.onload = resolve;
            document.body.appendChild(script);
        });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    setBanner() {
        this.iBanner = this.getRandomNumber(1, 13);
        this.iBanner = this.iBanner == 13 ? 1 : this.iBanner + 1;
        switch (this.iBanner) {
            case 1: this._bannerText = 'Boldly Connecting The Dots, Like No One Ever Dared'; break;
            case 2: this._bannerText = 'Trucks and Loads'; break;
            case 3: this._bannerText = 'Unleash the Beast'; break;
            case 4: this._bannerText = 'A Bold New Frontier'; break;
            case 5: this._bannerText = 'The future of logistics'; break;
            case 6: this._bannerText = 'Take Control'; break;
            case 7: this._bannerText = 'The maverick of the logistics world'; break;
            case 8: this._bannerText = 'Fasten your seatbelts'; break;
            case 9: this._bannerText = 'They can\'t ignore us'; break;
            case 10: this._bannerText = 'Don\'t Just Move Loads. Make Waves.'; break;
            case 11: this._bannerText = 'Connecting load owners with vehicle owners'; break;
            case 12: this._bannerText = 'It\'s a Match!'; break;
            case 13: this._bannerText = '...connecting.the.dots...'; break;
            default: this._bannerText = 'LOADGISTIX'; break;
        }
        setTimeout(() => {
            this.setBanner();
        }, 5000);
    }

    getRandomNumber(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }

    navigateExternal(event: Event, url: string) {
        event.preventDefault();
        if (Capacitor.isNativePlatform()) {
            Browser.open({ url });
        } else {
            window.open(url, '_blank');
        }
    }

    quote() {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;

        const dialogRef = this.dialog.open(DialogQuoteComponent,
            dialogConfig);
    }
}

