import * as moment from 'moment';
import { CalendarController } from './calendar.component.controller';
import { CalendarComponent } from './calendar.component';
import CalendarTemplate = require( './calendar.component.html' );
import { CalendarApiService } from './shared/calendar-api.service';
import { environment, $mdDialogMock } from '../shared/tests/index';
import { SourcesFilterController, sourcesFilterTemplate } from '../layout/sources-filter/index';

let expect = chai.expect;

describe( 'Calendar', () => {

    let sandbox: Sinon.SinonSandbox;
    beforeEach(() => sandbox = sinon.sandbox.create() );
    afterEach(() => sandbox.restore() );

    describe( 'Controller', () => {
        // SUT
        let controller: CalendarController;
        //  test doubles
        let calendarApiService: CalendarApiService;

        // create SUT
        beforeEach(() => {
            environment.refresh();
            calendarApiService = <CalendarApiService>{ getAvailableCalendars() { }, getFullCalendars() { } };
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
            let availableCalendars = [ { name: 'SEFAZ' }, { name: 'SEGER' }, { name: 'SEJUS' }];
            let availableCalendarsNames = [ 'SEFAZ', 'SEGER', 'SEJUS' ];
            let fullCalendars = [
                { name: 'SEFAZ', color: '#111' },
                { name: 'SEGER', color: '#222' },
                { name: 'SEJUS', color: '#333' }
            ];

            // configure test doubles
            beforeEach(() => {
                sandbox.stub( calendarApiService, 'getAvailableCalendars' )
                    .returnsPromise()
                    .resolves( availableCalendars );

                sandbox.stub( calendarApiService, 'getFullCalendars' )
                    .withArgs( availableCalendars )
                    .returnsPromise()
                    .resolves( fullCalendars );
            });

            it( 'should fill available calendars list with available calendars names', async () => {
                await controller.activate();
                expect( controller.availableCalendars ).to.deep.equal( availableCalendarsNames );
            });

            it( 'should select all available calendars', async () => {
                await controller.activate();
                expect( controller.selectedCalendars ).to.deep.equal( availableCalendarsNames );
            });

            it( 'should load all available calendars', async () => {
                const loadCalendars = sandbox.stub( controller, 'loadCalendars' );

                await controller.activate();
                expect( loadCalendars.calledWithExactly( availableCalendarsNames ) ).to.true;
            });
        });

        describe( 'loadCalendars( selectedCalendars )', () => {
            it( 'should fill calendar.eventSources', async () => {
                let selectedCalendars = [ 'SEFAZ', 'SEGER' ];
                let fullCalendars = [ { name: 'SEFAZ' }, { name: 'SEGER' }];

                sandbox.stub( calendarApiService, 'getFullCalendars' )
                    .withArgs( selectedCalendars )
                    .returnsPromise()
                    .resolves( fullCalendars );

                await controller.loadCalendars( selectedCalendars );

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
            let selectedCalendars = [ 'SEFAZ', 'SEGER' ];
            let sourceFilter = {
                origins: [ 'SEDU', 'SEFAZ', 'SEAMA' ]
            };

            beforeEach(() => {
                controller.availableCalendars = [ 'SEDU', 'SEFAZ', 'SEAMA', 'SECON', 'SEGER' ];
                controller.selectedCalendars = selectedCalendars;
                $mdDialogShow = sandbox.stub( $mdDialogMock, 'show' );
                $mdDialogShow.returnsPromise().resolves( sourceFilter );
            });

            it( 'should open sources filter', () => {
                // copy because openFilter() execution changes controller.selectedCalendars
                const selectedCalendarsBeforeFilter = angular.copy( controller.selectedCalendars );

                controller.openFilter();

                expect( $mdDialogShow.calledWithExactly( {
                    controller: SourcesFilterController,
                    template: sourcesFilterTemplate,
                    bindToController: true,
                    controllerAs: 'vm',
                    locals: {
                        availableOrigins: controller.availableCalendars,
                        selectedOrigins: selectedCalendarsBeforeFilter
                    }
                }) ).to.be.true;
            });

            describe( 'on sources filter edited:', () => {
                it( 'should selected calendars', () => {

                    controller.openFilter();

                    expect( controller.selectedCalendars ).to.be.deep.equal( sourceFilter.origins );
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

