import { IScope } from 'angular';
import { DriverLicense, DriverLicenseStorage, DetranApiService } from '../shared/index';
import driverLicenseImgUrl = require( './img/cnh-frente.jpg' );
import registerLicenseTemplate = require( '../shared/add-license/add-license.html' );
import { AddLicenseController } from '../shared/add-license/add-license.controller';
import { TransitionService } from '../../shared/shared.module';

/**
 * @class DriverLicenseController
 */
export class DriverLicenseController {

    public static $inject: string[] = [ '$scope', 'detranApiService', 'detranStorage', '$mdDialog', 'transitionService' ];

    public imgLicense: string;

    /**
     * Creates an instance of DriverLicenseController.
     * 
     * @param {IScope} $scope
     * @param {angular.ui.IStateService} $state
     * @param {any} $ionicHistory
     * @param {DetranApiService} detranApiService
     * @param {DriverLicenseStorage} driverLicenseStorage
     * @param {angular.material.IDialogService} $mdDialog
     */
    constructor( private $scope: IScope,
        private detranApiService: DetranApiService,
        private driverLicenseStorage: DriverLicenseStorage,
        private $mdDialog: angular.material.IDialogService,
        private transitionService: TransitionService ) {
        this.$scope.$on( '$ionicView.beforeEnter', () => this.activate() );
    }


    /**
     * 
     */
    public activate(): void {
        this.imgLicense = driverLicenseImgUrl;
        if ( this.hasDriverLicense ) {
            this.navigateTo( 'app.driverLicenseStatus' );
        }
    }

    /**
     * 
     */
    public registerLicense(): void {
        this.$mdDialog.show( {
            controller: AddLicenseController,
            template: registerLicenseTemplate,
            bindToController: true,
            controllerAs: 'vm',
            locals: {
                registerNumber: Number( this.driverLicenseStorage.driverLicense.registerNumber ),
                ballot: Number( this.driverLicenseStorage.driverLicense.ballot )
            }
        })
            .then(( license: DriverLicense ) => {
                this.detranApiService.saveLicense( license )
                    .then(() => {
                        this.driverLicenseStorage.driverLicense = license;
                        this.navigateTo( 'app.driverLicenseStatus' );
                        return license;
                    });
            });
    }

    /**
     * 
     * @readonly
     * @type {boolean}
     */
    public get hasDriverLicense(): boolean {
        return this.driverLicenseStorage.hasDriverLicense;
    }

    /**
     * 
    */
    public navigateTo( stateName: string ) {
        this.transitionService.changeState( stateName, {}, { type: 'slide', direction: 'up' }, true );
    }
}
