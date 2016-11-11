import { ITimeoutService, IScope } from 'angular';

export class TransitionService {

    public static $inject: string[] = [
        '$rootScope',
        '$state',
        '$timeout',
        '$ionicHistory',
        '$ionicNativeTransitions'
    ];

    /**
     * 
     * 
     * @private
     * @type {(string | undefined)}
     * @memberOf TransitionService
     */
    private currentState: string | undefined = undefined;

    /**
     * Creates an instance of TransitionService.
     * 
     * @param {IScope} $rootScope
     * @param {angular.ui.IStateService} $state
     * @param {ITimeoutService} $timeout
     * @param {ionic.navigation.IonicHistoryService} $ionicHistory
     * @param {any} $ionicNativeTransitions
     * 
     * @memberOf TransitionService
     */
    constructor( private $rootScope: IScope,
        private $state: angular.ui.IStateService,
        private $timeout: ITimeoutService,
        private $ionicHistory: ionic.navigation.IonicHistoryService,
        private $ionicNativeTransitions ) {
    }

    /**
     * 
     * 
     * @param {string} stateName
     * 
     * @memberOf TransitionService
     */
    public changeRootState( stateName: string ): void {
        this.changeState( stateName, {}, {}, { root: true, noBack: true });
    }

    /**
     * 
     * 
     * @param {string} stateName
     * 
     * @memberOf TransitionService
     */
    public changeMenuState( stateName: string ) {
        this.changeState( stateName, {}, { type: 'fade' }, { noBack: false });
    }

    /**
     * 
     * 
     * @param {string} stateName
     * @param {string} direction
     * 
     * @memberOf TransitionService
     */
    public changeTab( stateName: string, direction: string ): void {
        let options = { type: 'slide', direction: direction };
        this.changeState( stateName, {}, options, { root: false, tabs: true });
    }

    /**
     * 
     * Save the new currentState and call $ionicGoBack
     * 
     * @memberOf TransitionService
     */
    public goBack() {
        let backView = this.$ionicHistory.backView();
        if ( backView ) {
            this.currentState = backView.stateName;
        }
        this.$rootScope.$ionicGoBack();
    }

    /**
     * 
     * 
     * @param {string} stateName
     * @param {*} [routeParameters={}]
     * @param {*} [options={}]
     * @param {any} [{ root = false, tabs = false, reload = false, noBack = false }={}]
     * @returns {void}
     * 
     * @memberOf TransitionService
     */
    public changeState( newState: string, routeParameters: any = {}, options: any = {}, { root = false, tabs = false, reload = false, noBack = false } = {}): void {
        if ( newState === this.currentState ) {
            return;
        }

        let allOptions: any = {};
        angular.extend( allOptions, options );

        this.$ionicHistory.nextViewOptions( { disableBack: noBack, historyRoot: root });

        if ( tabs ) {
            if ( this.$rootScope.isAndroid ) {
                allOptions.fixedPixelsTop = 93;
            } else if ( this.$rootScope.isIOS ) {
                allOptions.fixedPixelsBottom = 48;
            }
        }

        this.currentState = newState;

        if ( angular.equals( allOptions, {}) ) {
            this.$state.go( newState, routeParameters, { reload: reload });
        } else {
            this.$ionicNativeTransitions.stateGo( newState, routeParameters, { reload: reload }, allOptions );
        }
    }

    /**
     * 
     * 
     * 
     * @memberOf TransitionService
     */
    public clearCache(): Promise<{}> {
        // limpa view caches do ionic
        // ref: http://stackoverflow.com/questions/29593018/ionic-there-is-a-way-to-delete-the-cache-in-controller-method
        return new Promise(( resolve ) => {
            this.$timeout(() => {
                this.$ionicHistory.clearCache();
                this.$ionicHistory.clearHistory();
                resolve();
            }, 100 );
        });
    }
}