import { IScope } from 'angular';
import { SourcesFilterController, sourcesFilterTemplate } from '../layout/sources-filter/index';
import { CalendarApiService, Calendar } from './shared/index';

export class CalendarController {

    public static $inject: string[] = [ '$scope', '$mdDialog', 'calendarApiService' ];

    public calendar: { currentDate?: Date; eventSources?: Calendar[]; } = {};
    public selectedCalendars: string[] = [];
    public availableCalendars: string[] = [];
    public viewTitle: string = '';

    /**
     * @constructor
     *
     * @param {Object} $scope
     * @param {CalendarApiService} calendarApiService - calendarApiService service
     */
    constructor( private $scope: IScope,
        private $mdDialog: angular.material.IDialogService,
        private calendarApiService: CalendarApiService ) {
        this.$scope.$on( '$ionicView.loaded', () => this.activate() );
    }


    /**
     * Ativa o component
     *
     * @returns {void}
     */
    public async activate() {
        let availableCalendars = await this.calendarApiService.getAvailableCalendars();
        this.availableCalendars = availableCalendars.map( calendar => calendar.name );
        this.selectedCalendars = angular.copy( this.availableCalendars );

        this.loadCalendars( this.availableCalendars );
    }

    /**
     * Carrega os eventos dos calendários selecionados
     */
    public async loadCalendars( selectedCalendars: string[] ) {
        this.calendar.eventSources = await this.calendarApiService.getFullCalendars( selectedCalendars );
    }

    /**
     * Evento disparado quando título do calendário é alterado
     *
     * @param {String} title - o novo title do calendário
     *
     * @returns {void}
     */
    public onViewTitleChanged( title: string ): void {
        this.viewTitle = title;
    }

    /**
     * 
     * 
     * @readonly
     * @type {number}
     * @memberOf CalendarController
     */
    public get currentDay(): number {
        return new Date().getDate();
    }

    /**
     * Altera a data do calendário para a data corrente (hoje e agora)
     *
     * @returns {void}
     */
    public today(): void {
        this.calendar.currentDate = new Date();
    }

    /**
     * Indica se a data selecionada no calendário é a data corrente
     *
     * @param {String} title - o novo title do calendário
     *
     * @returns {boolean} - true ou false dependendo se a data selecionada no calendário é a data corrente
     */
    public isToday(): boolean {
        let today = new Date();
        let currentCalendarDate = new Date( this.calendar.currentDate! );

        today.setHours( 0, 0, 0, 0 );
        currentCalendarDate.setHours( 0, 0, 0, 0 );

        return today.getTime() === currentCalendarDate.getTime();
    }


    /**
   * Abre filtro(popup) por fonte da notícia
   */
    public openFilter() {
        const options = {
            controller: SourcesFilterController,
            template: sourcesFilterTemplate,
            bindToController: true,
            controllerAs: 'vm',
            locals: {
                availableOrigins: this.availableCalendars,
                selectedOrigins: this.selectedCalendars
            }
        };
        this.$mdDialog.show( options ).then( filter => {
            this.selectedCalendars = filter.origins;
            this.loadCalendars( this.selectedCalendars );
        });
    }
}


