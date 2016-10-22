import * as moment from 'moment';
import { CalendarController } from './calendar.component.controller';
import CalendarComponent from './calendar.component';
import CalendarTemplate = require('./calendar.component.html');
import { CalendarApiService } from './shared/calendar-api.service';
import { environment, $mdDialogMock } from '../shared/tests/index';
import { SourcesFilterController, sourcesFilterTemplate } from '../layout/sources-filter/index';

let expect = chai.expect;

describe( 'Calendar', () => {

    let sandbox: Sinon.SinonSandbox;
    beforeEach(() => sandbox = sinon.sandbox.create() );
    afterEach(() => sandbox.restore() );

    describe( 'Controller', () => {
        let controller: CalendarController;
        let calendarApiService: CalendarApiService;

        // mocka data
        let availableCalendars = [ { name: 'SEFAZ' }, { name: 'SEGER' }, { name: 'SEJUS' }];
        let availableCalendarsNames = availableCalendars.map( calendar => calendar.name );
        let selectedCalendars = [ 'SEFAZ', 'SEGER' ];
        let fullCalendars = [ { name: 'SEFAZ' }, { name: 'SEGER' }, { name: 'SEJUS' }, { name: 'SECOM' }];

        // stubs
        let getAvailableCalendarsApi: Sinon.SinonPromise;
        let getFullCalendarsApi: Sinon.SinonPromise;

        beforeEach(() => {
            environment.refresh();
            calendarApiService = <CalendarApiService>{ getAvailableCalendars() { }, getFullCalendars() { } };
            getAvailableCalendarsApi = sandbox.stub( calendarApiService, 'getAvailableCalendars' ).returnsPromise();
            getFullCalendarsApi = sandbox.stub( calendarApiService, 'getFullCalendars' ).returnsPromise();

            controller = new CalendarController( environment.$scope, $mdDialogMock, calendarApiService );
        });

        describe( 'on instantiation', () => {

            it( 'should have a empty calendar', () => {
                expect( controller.calendar ).to.be.empty;
            });

            it( 'no calendar should be selected', () => {
                expect( controller.selectedCalendars ).to.be.empty;
            });

            it( 'no calendar should be available', () => {
                expect( controller.availableCalendars ).to.be.empty;
            });

            it( 'should activate on $ionicView.loaded event', () => {
                let activate = sandbox.stub( controller, 'activate' ); // replace original activate

                // simulates ionic before event trigger
                environment.onIonicLoadedEvent();

                expect( activate.called ).to.be.true;
            });
        });

        describe( 'activate()', () => {

            let getAvailableCalendars: Sinon.SinonSpy;
            let loadCalendars: Sinon.SinonSpy;

            beforeEach(() => {
                getAvailableCalendars = sandbox.spy( controller, 'getAvailableCalendars' );
                loadCalendars = sandbox.spy( controller, 'loadCalendars' );

                getAvailableCalendarsApi.resolves( availableCalendars );
                getFullCalendarsApi.resolves( fullCalendars );

                controller.activate();
            });

            it( 'should call getAvailableCalendars()', () => {
                expect( getAvailableCalendars.calledOnce ).to.be.true;
            });

            it( 'should call loadCalendars( availableCalendars )', () => {
                expect( loadCalendars.calledWith( availableCalendarsNames ) ).to.be.true;
            });
        });


        describe( 'getAvailableCalendars()', () => {

            beforeEach(() => {
                getAvailableCalendarsApi.resolves( availableCalendars );
                controller.getAvailableCalendars();
            });

            it( 'should fill available calendars list with calendars names', () => {
                expect( controller.availableCalendars ).to.deep.equal( availableCalendarsNames );
            });

            it( 'should select all available calendars', () => {
                expect( controller.selectedCalendars ).to.deep.equal( availableCalendarsNames );
            });
        });

        describe( 'loadCalendars( selectedCalendars )', () => {
            beforeEach(() => {
                getFullCalendarsApi.resolves( fullCalendars );
                controller.loadCalendars( selectedCalendars );
            });

            it( 'should fill calendar.eventSources', () => {
                expect( controller.calendar.eventSources ).to.equal( fullCalendars );
            });
        });

        describe( 'onViewTitleChanged( title )', () => {
            it( 'should assign title to controller.viewTitle property', () => {
                let title = 'Title Fake';

                controller.onViewTitleChanged( title );

                expect( controller.viewTitle ).to.equal( title );
            });
        });

        describe( 'today()', () => {
            it( 'should assign current date to calendar.currentDate property', () => {

                let futureDate = new Date( 2020, 10, 10 );
                let today = new Date();

                controller.calendar.currentDate = futureDate;

                expect( moment( controller.calendar.currentDate ).isSame( futureDate, 'day' ) ).to.be.true;

                controller.today();

                expect( moment( controller.calendar.currentDate ).isSame( today, 'day' ) ).to.be.true;
            });
        });

        describe( 'currentDay', () => {
            it( 'should return the current month day', () => {
                let monthDay = new Date().getDate();
                expect( controller.currentDay ).to.be.equal( monthDay );
            });
        });

        describe( 'isToday()', () => {
            it( 'should check if calendar current date is today', () => {

                let futureDate = new Date( 2020, 10, 10 );
                let today = new Date();

                controller.calendar.currentDate = futureDate;

                expect( controller.isToday() ).to.be.false;

                controller.calendar.currentDate = today;

                expect( controller.isToday() ).to.be.true;
            });

            it( 'should ignore date time part on comparation', () => {

                let todayMorning = new Date();
                let todayAfternoon = new Date();

                todayMorning.setHours( 9, 0, 0, 0 );
                todayAfternoon.setHours( 22, 0, 0, 0 );

                controller.calendar.currentDate = todayMorning;
                expect( controller.isToday() ).to.be.true;

                controller.calendar.currentDate = todayAfternoon;
                expect( controller.isToday() ).to.be.true;
            });
        });

        describe( 'openFilter()', () => {

            let $mdDialogShow: Sinon.SinonStub;

            beforeEach(() => {
                $mdDialogShow = sandbox.stub( $mdDialogMock, 'show' );
                $mdDialogShow.returnsPromise();
            });

            it( 'should open sources filter', () => {
                controller.availableCalendars = availableCalendarsNames;
                controller.selectedCalendars = selectedCalendars;

                controller.openFilter();

                expect( $mdDialogShow.calledWithExactly( {
                    controller: SourcesFilterController,
                    template: sourcesFilterTemplate,
                    bindToController: true,
                    controllerAs: 'vm',
                    locals: {
                        availableOrigins: controller.availableCalendars,
                        selectedOrigins: controller.selectedCalendars
                    }
                }) ).to.be.true;
            });

            describe( 'on sources filter edited:', () => {
                it( 'should load selected calendars', () => {
                    let sourceFilter = {
                        origins: [ 'SEDU', 'SEFAZ', 'SEAMA' ]
                    };
                    $mdDialogShow.returnsPromise().resolves( sourceFilter );
                    let loadCalendars = sandbox.stub( controller, 'loadCalendars' );

                    controller.openFilter();

                    expect( loadCalendars.calledWithExactly( sourceFilter.origins ) ).to.be.true;
                });
            });
        });
    });

    describe( 'Component', () => {
        // test the component/directive itself
        let component = CalendarComponent();

        it( 'should use the right controller', () => {
            expect( component.controller ).to.equal( CalendarController );
        });

        it( 'should use the right template', () => {
            expect( component.template ).to.equal( CalendarTemplate );
        });

        it( 'should use controllerAs', () => {
            expect( component ).to.have.property( 'controllerAs' );
        });

        it( 'should use controllerAs "vm"', () => {
            expect( component.controllerAs ).to.equal( 'vm' );
        });

        it( 'should use bindToController: true', () => {
            expect( component ).to.have.property( 'bindToController' );
            expect( component.bindToController ).to.equal( true );
        });
    });
});

