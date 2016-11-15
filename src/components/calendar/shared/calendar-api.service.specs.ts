/*
 eslint
 no-undef: 0,
 dot-notation: 0,
 angular/di: 0,
 no-unused-expressions: 0
 */
import { CalendarApiService } from './calendar-api.service';
import { Settings, ISettings } from '../../shared/settings/index';
import { $httpMock } from '../../shared/tests/index';

let expect = chai.expect;

describe( 'CalendarApiService', () => {

    let sandbox: Sinon.SinonSandbox;
    beforeEach(() => sandbox = sinon.sandbox.create() );
    afterEach(() => sandbox.restore() );

    let calendarApiService: CalendarApiService;
    let settings: ISettings;
    let $httpGet: Sinon.SinonStub;

    beforeEach(() => {
        $httpGet = sandbox.stub( $httpMock, 'get' );
        $httpGet.returnsPromise().resolves( [ 'SESA', 'SEDU', 'SETUR' ] );
        settings = Settings.getInstance();

        calendarApiService = new CalendarApiService( $httpMock, settings );
    });

    describe( 'getAvailableCalendars()', () => {
        it( 'should call calendars api endpoint', () => {
            calendarApiService.getAvailableCalendars();

            expect( $httpGet.calledWith( settings.api.calendars ) ).to.be.true;
        });

        it( 'should normalize response to response.data property', () => {
            let response = {
                data: [
                    { name: 'SEGER' }, { name: 'SEJUS' }, { name: 'PRODEST' }
                ]
            };
            $httpGet.returnsPromise().resolves( response );

            calendarApiService.getAvailableCalendars().then(( calendars ) => {
                expect( calendars ).to.deep.equal( response.data );
            });
        });
    });

    describe( 'getFullCalendars( calendars, options = {} )', () => {

        describe( 'always', () => {

            it( 'should call calendars events api endpoint', () => {

                calendarApiService.getFullCalendars( [] );

                expect( $httpGet.calledWith( `${settings.api.calendars}/events` ) ).to.be.true;
            });

            it( 'should normalize response to response.data property', () => {
                let response = {
                    data: [
                        { name: 'SEGER' }, { name: 'SEJUS' }, { name: 'PRODEST' }
                    ]
                };
                $httpGet.returnsPromise().resolves( response );

                calendarApiService.getFullCalendars( [], {}).then(( calendars ) => {
                    expect( calendars ).to.deep.equal( response.data );
                });
            });
        });

        describe( 'with no provided calendars', () => {

            it( 'should use default empty calendar list', () => {

                calendarApiService.getFullCalendars();
                calendarApiService.getFullCalendars( undefined );

                expect( $httpGet.getCall( 0 ).args[ 1 ].params.calendars ).to.deep.equal( [] );
                expect( $httpGet.getCall( 1 ).args[ 1 ].params.calendars ).to.deep.equal( [] );
            });
        });

        describe( 'with provided options', () => {

            it( 'should use all provided options', () => {

                let date = new Date( 2022, 10, 10 );
                let selectedCalendars = [ 'SEJUS', 'SEGER' ];
                let options = {
                    singleEvents: false,
                    orderBy: 'endTime',
                    timeMin: date,   // começo do ano corrente
                    timeMax: date, // final do ano corrente
                    timeZone: 'America/New_York',
                    calendars: [ 'SEJUS' ]
                };

                calendarApiService.getFullCalendars( selectedCalendars, options );

                expect( $httpGet.calledWithExactly( `${settings.api.calendars}/events`, {
                    params: {
                        calendars: options.calendars,
                        singleEvents: options.singleEvents,
                        orderBy: options.orderBy,
                        timeMin: options.timeMin,   // começo do ano corrente
                        timeMax: options.timeMax, // final do ano corrente
                        timeZone: options.timeZone
                    }
                }) ).to.be.true;
            });
        });

        describe( 'with no options', () => {

            it( 'should call calendars events endpoint with default filters', () => {

                let today = new Date();
                let defaults = {
                    singleEvents: true,
                    orderBy: 'startTime',
                    timeMin: new Date( today.getFullYear(), 0, 1, 0 ),   // começo do ano corrente
                    timeMax: new Date( today.getFullYear(), 11, 31, 0 ), // final do ano corrente
                    timeZone: 'America/Sao_Paulo' // an option!
                };

                calendarApiService.getFullCalendars( [] );

                expect( $httpGet.calledWithExactly( `${settings.api.calendars}/events`, {
                    params: {
                        calendars: [],
                        singleEvents: defaults.singleEvents,
                        orderBy: defaults.orderBy,
                        timeMin: defaults.timeMin,   // começo do ano corrente
                        timeMax: defaults.timeMax, // final do ano corrente
                        timeZone: defaults.timeZone
                    }
                }) ).to.be.true;
            });
        });
    });
});



