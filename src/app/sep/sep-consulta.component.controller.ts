import { IScope } from 'angular';
import { SocialSharing, BarcodeScanner } from 'ionic-native';
import { SepApiService, Process, ProcessUpdate, SepStorageService } from './shared/index';
import { ToastService, ToastOptions } from '../shared/shared.module';
import { AuthenticationService } from '../security/security.module';
import { AuthNeededController, authNeededTemplate } from '../layout/auth-needed/index';

export class SepConsultaController {

    public static $inject: string[] = [
        '$scope',
        '$ionicScrollDelegate',
        '$stateParams',
        'toast',
        'sepApiService',
        'authenticationService',
        '$mdDialog',
        'sepStorageService'
    ];

    public processNumberModel: number | undefined;
    public lastProcessNumber: string | undefined;
    public process: Process | undefined;
    public searched: boolean;
    public searching: boolean;
    public showAllUpdates: boolean;
    public filteredFavorites: string[];

    /**
     * Creates an instance of SepConsultaController.
     * @param {IScope} $scope 
     * @param {ionic.scroll.IonicScrollDelegate} $ionicScrollDelegate 
     * @param {angular.ui.IStateParamsService} $stateParams 
     * @param {ToastService} toast 
     * @param {SepApiService} sepApiService 
     * @param {AuthenticationService} authenticationService 
     * @param {angular.material.IDialogService} $mdDialog 
     * @param {SepStorageService} sepStorageService 
     * 
     * @memberOf SepConsultaController
     */
    constructor( private $scope: IScope,
        private $ionicScrollDelegate: ionic.scroll.IonicScrollDelegate,
        private $stateParams: angular.ui.IStateParamsService,
        private toast: ToastService,
        private sepApiService: SepApiService,
        private authenticationService: AuthenticationService,
        private $mdDialog: angular.material.IDialogService,
        private sepStorageService: SepStorageService ) {
        this.$scope.$on( '$ionicView.loaded', () => this.activate() );
    }

    /**
     * 
     * 
     * 
     * @memberOf SepConsultaController
     */
    public async activate () {
        this.processNumberModel = undefined;
        this.lastProcessNumber = undefined;
        this.process = undefined; 
        this.searched = false;
        this.showAllUpdates = false;
        this.searching = false;
        this.filteredFavorites = [];

        if ( !this.authenticationService.user.anonymous ) {
            await this.sepApiService.syncFavoriteProcessData();
            this.filteredFavorites = this.favoriteProcess;
        }

        const processNumber = this.$stateParams[ 'processNumber' ];
        if ( processNumber ) {
            this.processNumberModel = +processNumber;
            await this.getProcess( this.processNumber );
        }
    }

    private get processNumber () {
        return this.processNumberModel ? '' + this.processNumberModel : undefined;
    }

    public get hasFavorites (): boolean {
        return this.sepStorageService.hasFavoriteProcess;
    }

    public get favoriteProcess () {
        return this.sepStorageService.favoriteProcess.favoriteProcess || [];
    }

    public get isFavorite (): boolean {
        return !!this.process && this.sepStorageService.isFavoriteProcess( this.process.number );
    }

    /**
     * Obtém um processo eletrônico pelo número do processo.
     * 
     * @param {number} processNumber
     * @returns
     * 
     * @memberOf SepConsultaController
     */
    public async getProcess ( processNumber?: string ) {
        if ( !processNumber ) {
            this.toast.info( { title: 'N° do processo é obrigatório' } as ToastOptions ); return;
        }

        try {
            this.process = await this.sepApiService.getProcessByNumber( processNumber );
        }
        catch ( error ) {
            this.process = undefined;
        }
        finally {
            this.searched = true;
            this.searching = false;
            this.lastProcessNumber = this.process ? undefined : processNumber;
        };
    }

    /**
     * Evento disparado quando o enter(return) é pressionado.
     * Disparado pela diretiva input-return. 
     * 
     * @param {string} processNumber
     * 
     * @memberOf SepConsultaController
     */
    public async onEnterPressed ( processNumber: string ) {
        await this.getProcess( processNumber );
    }

    /**
     * Obtém a última atualização do processo
     * 
     * @readonly
     * @type {ProcessUpdate}
     */
    public get lastUpdate (): ProcessUpdate | undefined {
        if ( this.process ) {
            return this.process.updates[ 0 ];
        }
    }

    /**
     * Alterna a visibilidade das atualizações do processo eletrônico
     */
    public toggleUpdates (): void {
        this.showAllUpdates = !this.showAllUpdates;
        this.$ionicScrollDelegate.scrollTo( 0, 300, true ); // TODO: try to search the element to scroll: anchorScroll
    }

    /**
    * 
    * 
    * @param {string} link
    * 
    * @memberOf NewsDetailController
    */
    public share ( process: Process ): void {
        SocialSharing.shareWithOptions( {
            message: `SEP - Processo ${process.number}`,
            subject: `SEP - Processo ${process.number}`,
            url: process.pageUrl
        } );
    }

    public goToProcess ( processNumber: string ) {
        this.processNumberModel = +processNumber;
        this.getProcess( this.processNumber );
    }

    public searchActive ( active: boolean ): void {
        this.searching = active;
    }

    /**
     * 
     * 
     * 
     * @memberOf SepConsultaController
     */
    public async scanBarcode () {
        const scanOptions = {
            'preferFrontCamera': false, // iOS and Android
            'prompt': 'Posicione o código dentro da área de leitura', // supported on Android only
            'format': 'CODE_39'
        };

        try {
            const barcodeData = await BarcodeScanner.scan( scanOptions );
            if ( !!barcodeData.text ) {
                await this.getProcess( barcodeData.text );
            }
        }
        catch ( error ) {
            this.toast.error( { title: 'Não foi possível ler o código do processo' } );
        };
    }

    public toggleFavorite () {
        if ( !this.process ) {
            return;
        }
        if ( this.authenticationService.isAnonymous ) {
            // show modal
            this.showAuthNeededModal();
        } else {
            if ( this.isFavorite ) {
                this.sepStorageService.removeFromFavoriteProcess( this.process.number );
                this.toast.info( { title: `Acompanhamento removido` } );
            }
            else {
                this.sepStorageService.addToFavoriteProcess( this.process.number );
                this.toast.info( { title: `Acompanhando processo ${this.process.number}` } );
            }
            this.sepApiService.syncFavoriteProcessData( true );
        }
    }

    public filterFavorites () {
        if ( this.processNumber ) {
            this.filteredFavorites = this.favoriteProcess.filter( f => f.indexOf( this.processNumber! ) !== -1 );
        } else {
            this.filteredFavorites = this.favoriteProcess;
        }
    }

    public clear () {
        this.processNumberModel = undefined;
        if ( !this.authenticationService.user.anonymous ) {
            this.filteredFavorites = this.favoriteProcess;
        }
    }

    private showAuthNeededModal () {
        const options = {
            controller: AuthNeededController,
            template: authNeededTemplate,
            bindToController: true,
            controllerAs: 'vm'
        };
        this.$mdDialog.show( options );
    }
}
