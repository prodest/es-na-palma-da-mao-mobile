import { IScope } from 'angular';
import { SocialSharing, BarcodeScanner } from 'ionic-native';
import { SepApiService, Process, ProcessUpdate } from './shared/index';
import { ToastService, ToastOptions } from '../shared/shared.module';

export class SepConsultaController {

    public static $inject: string[] = [
        '$scope',
        '$ionicScrollDelegate',
        '$stateParams',
        'toast',
        'sepApiService'
    ];

    public processNumber: number | undefined;
    public lastProcessNumber: number | undefined;
    public process: Process | undefined;
    public searched: boolean;
    public showAllUpdates: boolean;


    /**
     * Creates an instance of SepConsultaController.
     * 
     * @param {IScope} $scope
     * @param {ionic.scroll.IonicScrollDelegate} $ionicScrollDelegate
     * @param {ToastService} toast
     * @param {SepApiService} sepApiService
     */
    constructor( private $scope: IScope,
        private $ionicScrollDelegate: ionic.scroll.IonicScrollDelegate,
        private $stateParams: angular.ui.IStateParamsService,
        private toast: ToastService,
        private sepApiService: SepApiService ) {
        this.$scope.$on( '$ionicView.loaded', () => this.activate() );
    }

    /**
     * 
     * 
     * 
     * @memberOf SepConsultaController
     */
    public async activate() {
        this.processNumber = undefined;
        this.lastProcessNumber = undefined;
        this.process = undefined;
        this.searched = false;
        this.showAllUpdates = false;

        const processNumber = this.$stateParams[ 'processNumber' ];
        if ( processNumber ) {
            this.processNumber = +processNumber;
            await this.getProcess( this.processNumber );
        }
    }

    /**
     * Obtém um processo eletrônico pelo número do processo.
     * 
     * @param {number} processNumber
     * @returns
     * 
     * @memberOf SepConsultaController
     */
    public async getProcess( processNumber?: number ) {
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
    public async onEnterPressed( processNumber: number ) {
        await this.getProcess( processNumber );
    }

    /**
     * Obtém a última atualização do processo
     * 
     * @readonly
     * @type {ProcessUpdate}
     */
    public get lastUpdate(): ProcessUpdate | undefined {
        if ( this.process ) {
            return this.process.updates[ 0 ];
        }
    }

    /**
     * Alterna a visibilidade das atualizações do processo eletrônico
     */
    public toggleUpdates(): void {
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
    public share( process: Process ): void {
        SocialSharing.shareWithOptions( {
            message: `SEP - Processo ${process.number}`,
            subject: `SEP - Processo ${process.number}`,
            url: process.pageUrl
        });
    }


    /**
     * 
     * 
     * 
     * @memberOf SepConsultaController
     */
    public async scanBarcode() {
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
            this.toast.error( { title: 'Não foi possível ler o código do processo' });
        };
    }
}
