import { FilterController } from './filter.controller';
import { $mdDialogMock, toastServiceMock } from '../../../shared/tests/index';

let expect = chai.expect;

describe( 'Dio/search/filter', () => {

    let sandbox: Sinon.SinonSandbox;
    beforeEach(() => sandbox = sinon.sandbox.create() );
    afterEach(() => sandbox.restore() );

    describe( 'Controller', () => {
        let controller: FilterController;
        beforeEach(() => {
            controller = new FilterController( $mdDialogMock, toastServiceMock );
        });

        describe( 'cancel()', () => {
            it( 'should cancel modal', () => {
                let cancel = sandbox.stub( $mdDialogMock, 'cancel' );

                controller.cancel();

                expect( cancel.called ).to.be.true;
            });
        });

        describe( 'ok(query,dateMin,dateMax)', () => {
            it( 'should show validation message if no query is provided', () => {
                let info = sandbox.stub( toastServiceMock, 'info' );

                controller.ok( '', '2015-1-1', '2016-1-1' );

                expect( info.calledWith( { title: 'Palavra-chave é obrigatória' }) ).to.be.true;
            });

            it( 'should close modal passing added filter', () => {
                let hide = sandbox.stub( $mdDialogMock, 'hide' );
                let query = 'prodest';
                let dateMin = '2015-1-1';
                let dateMax = '2016-1-1';

                controller.ok( query, dateMin, dateMax );

                expect( hide.calledWithExactly( { query, dateMin, dateMax }) ).to.be.true;
            });
        });
    });
});

