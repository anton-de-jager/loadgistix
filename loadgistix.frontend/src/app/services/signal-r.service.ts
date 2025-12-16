import { Injectable, OnDestroy, inject } from '@angular/core';
import { HubConnectionBuilder, HubConnection } from '@microsoft/signalr';
import * as signalR from '@microsoft/signalr';
import { load } from 'app/models/load.model';
import { bid } from 'app/models/bid.model';
import { directoryCategory } from 'app/models/directoryCategory.model';
import { environment } from 'environments/environment';
import { Subject } from 'rxjs';
import { Guid } from 'guid-typescript';
import { vehicle } from 'app/models/vehicle.model';
import { advert } from 'app/models/advert.model';
import { axel } from 'app/models/axel.model';
import { bodyLoad } from 'app/models/bodyLoad.model';
import { bodyType } from 'app/models/bodyType.model';
import { branch } from 'app/models/branch.model';
import { companyType } from 'app/models/companyType.model';
import { directory } from 'app/models/directory.model';
import { driver } from 'app/models/driver.model';
import { licenceType } from 'app/models/licenceType.model';
import { loadType } from 'app/models/loadType.model';
import { maintenancePlanned } from 'app/models/maintenancePlanned.model';
import { maintenancePlannedType } from 'app/models/maintenancePlannedType.model';
import { maintenanceUnPlanned } from 'app/models/maintenanceUnPlanned.model';
import { maintenanceUnPlannedType } from 'app/models/maintenanceUnPlannedType.model';
import { make } from 'app/models/make.model';
import { model } from 'app/models/model.model';
import { pdp } from 'app/models/pdp.model';
import { returnReason } from 'app/models/returnReason.model';
import { reviewDriver } from 'app/models/reviewDriver.model';
import { reviewLoad } from 'app/models/reviewLoad.model';
import { stockProblem } from 'app/models/stockProblem.model';
import { User } from 'app/core/user/user.types';
import { vehicleCategory } from 'app/models/vehicleCategory.model';
import { vehicleType } from 'app/models/vehicleType.model';
import { fuel } from 'app/models/fuel.model';
import { transaction } from 'app/models/transaction.model';
import { UserService } from 'app/core/user/user.service';
import { AuthService } from 'app/core/auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class SignalRService implements OnDestroy {
    private hubConnection: HubConnection;

    advertAdded = new Subject<advert>();
    advertUpdated = new Subject<advert>();
    advertDeleted = new Subject<Guid>();

    axelAdded = new Subject<axel>();
    axelUpdated = new Subject<axel>();
    axelDeleted = new Subject<Guid>();

    bidAdded = new Subject<bid>();
    bidUpdated = new Subject<bid>();
    bidDeleted = new Subject<Guid>();

    bodyLoadAdded = new Subject<bodyLoad>();
    bodyLoadUpdated = new Subject<bodyLoad>();
    bodyLoadDeleted = new Subject<Guid>();

    bodyTypeAdded = new Subject<bodyType>();
    bodyTypeUpdated = new Subject<bodyType>();
    bodyTypeDeleted = new Subject<Guid>();

    branchAdded = new Subject<branch>();
    branchUpdated = new Subject<branch>();
    branchDeleted = new Subject<Guid>();

    companyTypeAdded = new Subject<companyType>();
    companyTypeUpdated = new Subject<companyType>();
    companyTypeDeleted = new Subject<Guid>();

    directoryCategoryAdded = new Subject<directoryCategory>();
    directoryCategoryUpdated = new Subject<directoryCategory>();
    directoryCategoryDeleted = new Subject<Guid>();

    directoryAdded = new Subject<directory>();
    directoryUpdated = new Subject<directory>();
    directoryDeleted = new Subject<Guid>();

    driverAdded = new Subject<driver>();
    driverUpdated = new Subject<driver>();
    driverDeleted = new Subject<Guid>();

    fuelAdded = new Subject<fuel>();
    fuelUpdated = new Subject<fuel>();
    fuelDeleted = new Subject<Guid>();

    licenceTypeAdded = new Subject<licenceType>();
    licenceTypeUpdated = new Subject<licenceType>();
    licenceTypeDeleted = new Subject<Guid>();

    loadAdded = new Subject<load>();
    loadUpdated = new Subject<load>();
    loadDeleted = new Subject<Guid>();

    loadTypeAdded = new Subject<loadType>();
    loadTypeUpdated = new Subject<loadType>();
    loadTypeDeleted = new Subject<Guid>();

    maintenancePlannedAdded = new Subject<maintenancePlanned>();
    maintenancePlannedUpdated = new Subject<maintenancePlanned>();
    maintenancePlannedDeleted = new Subject<Guid>();

    maintenancePlannedTypeAdded = new Subject<maintenancePlannedType>();
    maintenancePlannedTypeUpdated = new Subject<maintenancePlannedType>();
    maintenancePlannedTypeDeleted = new Subject<Guid>();

    maintenanceUnPlannedAdded = new Subject<maintenanceUnPlanned>();
    maintenanceUnPlannedUpdated = new Subject<maintenanceUnPlanned>();
    maintenanceUnPlannedDeleted = new Subject<Guid>();

    maintenanceUnPlannedTypeAdded = new Subject<maintenanceUnPlannedType>();
    maintenanceUnPlannedTypeUpdated = new Subject<maintenanceUnPlannedType>();
    maintenanceUnPlannedTypeDeleted = new Subject<Guid>();

    makeAdded = new Subject<make>();
    makeUpdated = new Subject<make>();
    makeDeleted = new Subject<Guid>();

    modelAdded = new Subject<model>();
    modelUpdated = new Subject<model>();
    modelDeleted = new Subject<Guid>();

    pdpAdded = new Subject<pdp>();
    pdpUpdated = new Subject<pdp>();
    pdpDeleted = new Subject<Guid>();

    returnReasonAdded = new Subject<returnReason>();
    returnReasonUpdated = new Subject<returnReason>();
    returnReasonDeleted = new Subject<Guid>();

    reviewDriverAdded = new Subject<reviewDriver>();
    reviewDriverUpdated = new Subject<reviewDriver>();
    reviewDriverDeleted = new Subject<Guid>();

    reviewLoadAdded = new Subject<reviewLoad>();
    reviewLoadUpdated = new Subject<reviewLoad>();
    reviewLoadDeleted = new Subject<Guid>();

    stockProblemAdded = new Subject<stockProblem>();
    stockProblemUpdated = new Subject<stockProblem>();
    stockProblemDeleted = new Subject<Guid>();

    transactionAdded = new Subject<transaction>();
    transactionUpdated = new Subject<transaction>();
    transactionDeleted = new Subject<Guid>();

    userAdded = new Subject<User>();
    userUpdated = new Subject<User>();
    userDeleted = new Subject<Guid>();

    vehicleCategoryAdded = new Subject<vehicleCategory>();
    vehicleCategoryUpdated = new Subject<vehicleCategory>();
    vehicleCategoryDeleted = new Subject<Guid>();

    vehicleAdded = new Subject<vehicle>();
    vehicleUpdated = new Subject<vehicle>();
    vehicleDeleted = new Subject<Guid>();

    vehicleTypeAdded = new Subject<vehicleType>();
    vehicleTypeUpdated = new Subject<vehicleType>();
    vehicleTypeDeleted = new Subject<Guid>();

    constructor(private userService: UserService) {

     }

    public startConnection(hub: string): Promise<boolean> {
        var promise = new Promise<boolean>((resolve) => {
            try {
                resolve(this.initConnection(hub));
            } catch (exception) {
                resolve(false);
            }
        });
        return promise;
    }

    initConnection(hub): Promise<boolean> {
        var promise = new Promise<boolean>((resolve) => {
            try {
                this.hubConnection = new HubConnectionBuilder()
                    .withUrl(environment.hubs + hub + 'Hub', {
                        skipNegotiation: true,
                        transport: signalR.HttpTransportType.WebSockets,
                    })
                    .configureLogging(signalR.LogLevel.Debug)
                    .build();
                // console.log('this.hubConnection', this.hubConnection);
                this.hubConnection.start()
                    .then(() => {
                        resolve(true);
                        // console.log('SignalR connection started for ' + hub);
                        // Perform additional operations after the connection is established
                    })
                    .catch(error => {
                        resolve(false);
                        console.error('Error starting SignalR connection: ', error);
                    });
            } catch (exception) {
                resolve(false);
            }
        });
        return promise;
    }

    addAdvertAddedListener = () => {
        this.hubConnection.on('AdvertAdded', (advert: advert) => {
            this.advertAdded.next(advert);
        });
    }
    addAdvertUpdatedListener = () => {
        this.hubConnection.on('AdvertUpdated', (advert: advert) => {
            this.advertUpdated.next(advert);
        });
    }
    addAdvertDeletedListener = () => {
        this.hubConnection.on('AdvertDeleted', (id: Guid) => {
            this.advertDeleted.next(id);
        });
    }

    addAxelAddedListener = () => {
        this.hubConnection.on('AxelAdded', (axel: axel) => {
            this.axelAdded.next(axel);
        });
    }
    addAxelUpdatedListener = () => {
        this.hubConnection.on('AxelUpdated', (axel: axel) => {
            this.axelUpdated.next(axel);
        });
    }
    addAxelDeletedListener = () => {
        this.hubConnection.on('AxelDeleted', (id: Guid) => {
            this.axelDeleted.next(id);
        });
    }

    addBidAddedListener = () => {
        this.hubConnection.on('BidAdded', (bid: bid) => {
            this.bidAdded.next(bid);
        });
    }
    addBidUpdatedListener = () => {
        this.hubConnection.on('BidUpdated', (bid: bid) => {
            this.bidUpdated.next(bid);
        });
    }
    addBidDeletedListener = () => {
        this.hubConnection.on('BidDeleted', (id: Guid) => {
            this.bidDeleted.next(id);
        });
    }

    addBodyLoadAddedListener = () => {
        this.hubConnection.on('BodyLoadAdded', (bodyLoad: bodyLoad) => {
            this.bodyLoadAdded.next(bodyLoad);
        });
    }
    addBodyLoadUpdatedListener = () => {
        this.hubConnection.on('BodyLoadUpdated', (bodyLoad: bodyLoad) => {
            this.bodyLoadUpdated.next(bodyLoad);
        });
    }
    addBodyLoadDeletedListener = () => {
        this.hubConnection.on('BodyLoadDeleted', (id: Guid) => {
            this.bodyLoadDeleted.next(id);
        });
    }

    addBodyTypeAddedListener = () => {
        this.hubConnection.on('BodyTypeAdded', (bodyType: bodyType) => {
            this.bodyTypeAdded.next(bodyType);
        });
    }
    addBodyTypeUpdatedListener = () => {
        this.hubConnection.on('BodyTypeUpdated', (bodyType: bodyType) => {
            this.bodyTypeUpdated.next(bodyType);
        });
    }
    addBodyTypeDeletedListener = () => {
        this.hubConnection.on('BodyTypeDeleted', (id: Guid) => {
            this.bodyTypeDeleted.next(id);
        });
    }

    addBranchAddedListener = () => {
        this.hubConnection.on('BranchAdded', (branch: branch) => {
            this.branchAdded.next(branch);
        });
    }
    addBranchUpdatedListener = () => {
        this.hubConnection.on('BranchUpdated', (branch: branch) => {
            this.branchUpdated.next(branch);
        });
    }
    addBranchDeletedListener = () => {
        this.hubConnection.on('BranchDeleted', (id: Guid) => {
            this.branchDeleted.next(id);
        });
    }

    addCompanyTypeAddedListener = () => {
        this.hubConnection.on('CompanyTypeAdded', (companyType: companyType) => {
            this.companyTypeAdded.next(companyType);
        });
    }
    addCompanyTypeUpdatedListener = () => {
        this.hubConnection.on('CompanyTypeUpdated', (companyType: companyType) => {
            this.companyTypeUpdated.next(companyType);
        });
    }
    addCompanyTypeDeletedListener = () => {
        this.hubConnection.on('CompanyTypeDeleted', (id: Guid) => {
            this.companyTypeDeleted.next(id);
        });
    }

    addDirectoryCategoryAddedListener = () => {
        this.hubConnection.on('DirectoryCategoryAdded', (directoryCategory: directoryCategory) => {
            this.directoryCategoryAdded.next(directoryCategory);
        });
    }
    addDirectoryCategoryUpdatedListener = () => {
        this.hubConnection.on('DirectoryCategoryUpdated', (directoryCategory: directoryCategory) => {
            this.directoryCategoryUpdated.next(directoryCategory);
        });
    }
    addDirectoryCategoryDeletedListener = () => {
        this.hubConnection.on('DirectoryCategoryDeleted', (id: Guid) => {
            this.directoryCategoryDeleted.next(id);
        });
    }

    addDirectoryAddedListener = () => {
        this.hubConnection.on('DirectoryAdded', (directory: directory) => {
            this.directoryAdded.next(directory);
        });
    }
    addDirectoryUpdatedListener = () => {
        this.hubConnection.on('DirectoryUpdated', (directory: directory) => {
            this.directoryUpdated.next(directory);
        });
    }
    addDirectoryDeletedListener = () => {
        this.hubConnection.on('DirectoryDeleted', (id: Guid) => {
            this.directoryDeleted.next(id);
        });
    }

    addDriverAddedListener = () => {
        this.hubConnection.on('DriverAdded', (driver: driver) => {
            this.driverAdded.next(driver);
        });
    }
    addDriverUpdatedListener = () => {
        this.hubConnection.on('DriverUpdated', (driver: driver) => {
            this.driverUpdated.next(driver);
        });
    }
    addDriverDeletedListener = () => {
        this.hubConnection.on('DriverDeleted', (id: Guid) => {
            this.driverDeleted.next(id);
        });
    }

    addFuelAddedListener = () => {
        this.hubConnection.on('FuelAdded', (fuel: fuel) => {
            this.fuelAdded.next(fuel);
        });
    }
    addFuelUpdatedListener = () => {
        this.hubConnection.on('FuelUpdated', (fuel: fuel) => {
            this.fuelUpdated.next(fuel);
        });
    }
    addFuelDeletedListener = () => {
        this.hubConnection.on('FuelDeleted', (id: Guid) => {
            this.fuelDeleted.next(id);
        });
    }

    addLicenceTypeAddedListener = () => {
        this.hubConnection.on('LicenceTypeAdded', (licenceType: licenceType) => {
            this.licenceTypeAdded.next(licenceType);
        });
    }
    addLicenceTypeUpdatedListener = () => {
        this.hubConnection.on('LicenceTypeUpdated', (licenceType: licenceType) => {
            this.licenceTypeUpdated.next(licenceType);
        });
    }
    addLicenceTypeDeletedListener = () => {
        this.hubConnection.on('LicenceTypeDeleted', (id: Guid) => {
            this.licenceTypeDeleted.next(id);
        });
    }

    addLoadAddedListener = () => {
        this.hubConnection.on('LoadAdded', (load: load) => {
            this.loadAdded.next(load);
        });
    }
    addLoadUpdatedListener = () => {
        this.hubConnection.on('LoadUpdated', (load: load) => {
            this.loadUpdated.next(load);
        });
    }
    addLoadDeletedListener = () => {
        this.hubConnection.on('LoadDeleted', (id: Guid) => {
            this.loadDeleted.next(id);
        });
    }

    addLoadTypeAddedListener = () => {
        this.hubConnection.on('LoadTypeAdded', (loadType: loadType) => {
            this.loadTypeAdded.next(loadType);
        });
    }
    addLoadTypeUpdatedListener = () => {
        this.hubConnection.on('LoadTypeUpdated', (loadType: loadType) => {
            this.loadTypeUpdated.next(loadType);
        });
    }
    addLoadTypeDeletedListener = () => {
        this.hubConnection.on('LoadTypeDeleted', (id: Guid) => {
            this.loadTypeDeleted.next(id);
        });
    }

    addMaintenancePlannedAddedListener = () => {
        this.hubConnection.on('MaintenancePlannedAdded', (maintenancePlanned: maintenancePlanned) => {
            this.maintenancePlannedAdded.next(maintenancePlanned);
        });
    }
    addMaintenancePlannedUpdatedListener = () => {
        this.hubConnection.on('MaintenancePlannedUpdated', (maintenancePlanned: maintenancePlanned) => {
            this.maintenancePlannedUpdated.next(maintenancePlanned);
        });
    }
    addMaintenancePlannedDeletedListener = () => {
        this.hubConnection.on('MaintenancePlannedDeleted', (id: Guid) => {
            this.maintenancePlannedDeleted.next(id);
        });
    }

    addMaintenancePlannedTypeAddedListener = () => {
        this.hubConnection.on('MaintenancePlannedTypeAdded', (maintenancePlannedType: maintenancePlannedType) => {
            this.maintenancePlannedTypeAdded.next(maintenancePlannedType);
        });
    }
    addMaintenancePlannedTypeUpdatedListener = () => {
        this.hubConnection.on('MaintenancePlannedTypeUpdated', (maintenancePlannedType: maintenancePlannedType) => {
            this.maintenancePlannedTypeUpdated.next(maintenancePlannedType);
        });
    }
    addMaintenancePlannedTypeDeletedListener = () => {
        this.hubConnection.on('MaintenancePlannedTypeDeleted', (id: Guid) => {
            this.maintenancePlannedTypeDeleted.next(id);
        });
    }

    addMaintenanceUnPlannedAddedListener = () => {
        this.hubConnection.on('MaintenanceUnPlannedAdded', (maintenanceUnPlanned: maintenanceUnPlanned) => {
            this.maintenanceUnPlannedAdded.next(maintenanceUnPlanned);
        });
    }
    addMaintenanceUnPlannedUpdatedListener = () => {
        this.hubConnection.on('MaintenanceUnPlannedUpdated', (maintenanceUnPlanned: maintenanceUnPlanned) => {
            this.maintenanceUnPlannedUpdated.next(maintenanceUnPlanned);
        });
    }
    addMaintenanceUnPlannedDeletedListener = () => {
        this.hubConnection.on('MaintenanceUnPlannedDeleted', (id: Guid) => {
            this.maintenanceUnPlannedDeleted.next(id);
        });
    }

    addMaintenanceUnPlannedTypeAddedListener = () => {
        this.hubConnection.on('MaintenanceUnPlannedTypeAdded', (maintenanceUnPlannedType: maintenanceUnPlannedType) => {
            this.maintenanceUnPlannedTypeAdded.next(maintenanceUnPlannedType);
        });
    }
    addMaintenanceUnPlannedTypeUpdatedListener = () => {
        this.hubConnection.on('MaintenanceUnPlannedTypeUpdated', (maintenanceUnPlannedType: maintenanceUnPlannedType) => {
            this.maintenanceUnPlannedTypeUpdated.next(maintenanceUnPlannedType);
        });
    }
    addMaintenanceUnPlannedTypeDeletedListener = () => {
        this.hubConnection.on('MaintenanceUnPlannedTypeDeleted', (id: Guid) => {
            this.maintenanceUnPlannedTypeDeleted.next(id);
        });
    }

    addMakeAddedListener = () => {
        this.hubConnection.on('MakeAdded', (make: make) => {
            this.makeAdded.next(make);
        });
    }
    addMakeUpdatedListener = () => {
        this.hubConnection.on('MakeUpdated', (make: make) => {
            this.makeUpdated.next(make);
        });
    }
    addMakeDeletedListener = () => {
        this.hubConnection.on('MakeDeleted', (id: Guid) => {
            this.makeDeleted.next(id);
        });
    }

    addModelAddedListener = () => {
        this.hubConnection.on('ModelAdded', (model: model) => {
            this.modelAdded.next(model);
        });
    }
    addModelUpdatedListener = () => {
        this.hubConnection.on('ModelUpdated', (model: model) => {
            this.modelUpdated.next(model);
        });
    }
    addModelDeletedListener = () => {
        this.hubConnection.on('ModelDeleted', (id: Guid) => {
            this.modelDeleted.next(id);
        });
    }

    addReturnReasonAddedListener = () => {
        this.hubConnection.on('ReturnReasonAdded', (returnReason: returnReason) => {
            this.returnReasonAdded.next(returnReason);
        });
    }
    addReturnReasonUpdatedListener = () => {
        this.hubConnection.on('ReturnReasonUpdated', (returnReason: returnReason) => {
            this.returnReasonUpdated.next(returnReason);
        });
    }
    addReturnReasonDeletedListener = () => {
        this.hubConnection.on('ReturnReasonDeleted', (id: Guid) => {
            this.returnReasonDeleted.next(id);
        });
    }

    addReviewDriverAddedListener = () => {
        this.hubConnection.on('ReviewDriverAdded', (reviewDriver: reviewDriver) => {
            this.reviewDriverAdded.next(reviewDriver);
        });
    }
    addReviewDriverUpdatedListener = () => {
        this.hubConnection.on('ReviewDriverUpdated', (reviewDriver: reviewDriver) => {
            this.reviewDriverUpdated.next(reviewDriver);
        });
    }
    addReviewDriverDeletedListener = () => {
        this.hubConnection.on('ReviewDriverDeleted', (id: Guid) => {
            this.reviewDriverDeleted.next(id);
        });
    }

    addReviewLoadAddedListener = () => {
        this.hubConnection.on('ReviewLoadAdded', (reviewLoad: reviewLoad) => {
            this.reviewLoadAdded.next(reviewLoad);
        });
    }
    addReviewLoadUpdatedListener = () => {
        this.hubConnection.on('ReviewLoadUpdated', (reviewLoad: reviewLoad) => {
            this.reviewLoadUpdated.next(reviewLoad);
        });
    }
    addReviewLoadDeletedListener = () => {
        this.hubConnection.on('ReviewLoadDeleted', (id: Guid) => {
            this.reviewLoadDeleted.next(id);
        });
    }

    addStockProblemAddedListener = () => {
        this.hubConnection.on('StockProblemAdded', (stockProblem: stockProblem) => {
            this.stockProblemAdded.next(stockProblem);
        });
    }
    addStockProblemUpdatedListener = () => {
        this.hubConnection.on('StockProblemUpdated', (stockProblem: stockProblem) => {
            this.stockProblemUpdated.next(stockProblem);
        });
    }
    addStockProblemDeletedListener = () => {
        this.hubConnection.on('StockProblemDeleted', (id: Guid) => {
            this.stockProblemDeleted.next(id);
        });
    }

    addTransactionAddedListener = () => {
        this.hubConnection.on('TransactionAdded', (transaction: transaction) => {
            this.transactionAdded.next(transaction);
        });
    }
    addTransactionUpdatedListener = () => {
        this.hubConnection.on('TransactionUpdated', (transaction: transaction) => {
            this.transactionUpdated.next(transaction);
        });
    }
    addTransactionDeletedListener = () => {
        this.hubConnection.on('TransactionDeleted', (id: Guid) => {
            this.transactionDeleted.next(id);
        });
    }

    addUserAddedListener = () => {
        this.hubConnection.on('UserAdded', (user: User) => {
            this.userAdded.next(user);
        });
    }
    addUserUpdatedListener = () => {
        this.hubConnection.on('UserUpdated', (user: User) => {
            this.userUpdated.next(user);
        });
    }
    addUserDeletedListener = () => {
        this.hubConnection.on('UserDeleted', (id: Guid) => {
            this.userDeleted.next(id);
        });
    }

    addVehicleCategoryAddedListener = () => {
        this.hubConnection.on('VehicleCategoryAdded', (vehicleCategory: vehicleCategory) => {
            this.vehicleCategoryAdded.next(vehicleCategory);
        });
    }
    addVehicleCategoryUpdatedListener = () => {
        this.hubConnection.on('VehicleCategoryUpdated', (vehicleCategory: vehicleCategory) => {
            this.vehicleCategoryUpdated.next(vehicleCategory);
        });
    }
    addVehicleCategoryDeletedListener = () => {
        this.hubConnection.on('VehicleCategoryDeleted', (id: Guid) => {
            this.vehicleCategoryDeleted.next(id);
        });
    }

    addVehicleAddedListener = () => {
        this.hubConnection.on('VehicleAdded', (vehicle: vehicle) => {
            this.vehicleAdded.next(vehicle);
        });
    }
    addVehicleUpdatedListener = () => {
        this.hubConnection.on('VehicleUpdated', (vehicle: vehicle) => {
            this.vehicleUpdated.next(vehicle);
        });
    }
    addVehicleDeletedListener = () => {
        this.hubConnection.on('VehicleDeleted', (id: Guid) => {
            this.vehicleDeleted.next(id);
        });
    }

    addVehicleTypeAddedListener = () => {
        this.hubConnection.on('VehicleTypeAdded', (vehicleType: vehicleType) => {
            this.vehicleTypeAdded.next(vehicleType);
        });
    }
    addVehicleTypeUpdatedListener = () => {
        this.hubConnection.on('VehicleTypeUpdated', (vehicleType: vehicleType) => {
            this.vehicleTypeUpdated.next(vehicleType);
        });
    }
    addVehicleTypeDeletedListener = () => {
        this.hubConnection.on('VehicleTypeDeleted', (id: Guid) => {
            this.vehicleTypeDeleted.next(id);
        });
    }

    public endConnection(): void {
        this.hubConnection.stop();
    }

    ngOnDestroy(): void {
        this.endConnection();
    }
}
