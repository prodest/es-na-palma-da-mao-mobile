import { DatesFilterController } from './dates-filter.controller';
import { $mdDialogMock } from '../../../shared/tests/index';

let expect = chai.expect;

describe( 'News/news-list/dates-filter', () => {

    let sandbox: Sinon.SinonSandbox;
    beforeEach(() => sandbox = sinon.sandbox.create() );
    afterEach(() => sandbox.restore() );

    describe( 'Controller', () => {
        let controller: DatesFilterController;
        beforeEach(() => {
            controller = new DatesFilterController( $mdDialogMock );
        });

        describe( 'cancel()', () => {
            it( 'should cancel modal', () => {
                let cancel = sandbox.stub( $mdDialogMock, 'cancel' );

                controller.cancel();

                expect( cancel.called ).to.be.true;
            });
        });

        describe( 'ok()', () => {
            it( 'should close modal passing filter data', () => {
                let hide = sandbox.stub( $mdDialogMock, 'hide' );
                let dateMin = new Date( '01-01-2016' );
                let dateMax = new Date( '05-05-2016' );

                controller.ok( dateMin, dateMax );

                expect( hide.calledWith( { dateMin, dateMax }) ).to.be.true;
            });
        });
    });
});
