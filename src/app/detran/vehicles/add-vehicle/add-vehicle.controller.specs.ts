import { AddVehicleController } from './add-vehicle.controller';
import { $mdDialogMock, toastServiceMock } from '../../../shared/tests/index';

let expect = chai.expect;

describe( 'Detran/vehicles/add-vehicle', () => {

    let sandbox: Sinon.SinonSandbox;
    beforeEach(() => sandbox = sinon.sandbox.create() );
    afterEach(() => sandbox.restore() );

    describe( 'Controller', () => {
        let controller: AddVehicleController;
        beforeEach(() => {
            controller = new AddVehicleController( $mdDialogMock, toastServiceMock );
        });

        describe( 'cancel()', () => {
            it( 'should cancel modal', () => {
                let cancel = sandbox.stub( $mdDialogMock, 'cancel' );

                controller.cancel();

                expect( cancel.called ).to.be.true;
            });
        });

        describe( 'ok(plate,renavam)', () => {
            it( 'should show validation message if no plate is provided', () => {
                let info = sandbox.stub( toastServiceMock, 'info' );

                controller.ok( undefined, 123234345 );
                expect( info.calledWith( { title: 'Placa é obrigatória' }) ).to.be.true;
            });

            it( 'should show validation message if no renavam is provided', () => {
                let info = sandbox.stub( toastServiceMock, 'info' );

                controller.ok( '123234345', undefined );

                expect( info.calledWith( { title: 'RENAVAM é obrigatório' }) ).to.be.true;
            });

            it( 'should close modal passing added vehicle', () => {
                let hide = sandbox.stub( $mdDialogMock, 'hide' );
                let plate = '1111111111';
                let renavam = 222222222;

                controller.ok( plate, renavam );

                expect( hide.calledWithExactly( { plate, renavam }) ).to.be.true;
            });

            it( 'should remove all whitespaces from plate', () => {
                let hide = sandbox.stub( $mdDialogMock, 'hide' );
                let plate = '111111 1111  ';
                let renavam = 222222222;
                let normalizedPlate = '1111111111';

                controller.ok( plate, renavam );

                expect( hide.calledWithExactly( { plate: normalizedPlate, renavam: renavam }) ).to.be.true;
            });

            it( 'should convert plate to uppercase', () => {
                let hide = sandbox.stub( $mdDialogMock, 'hide' );
                let plate = 'ovl5008';
                let renavam = 33333333333;
                let normalizedPlate = 'OVL5008';

                controller.ok( plate, renavam );

                expect( hide.calledWithExactly( { plate: normalizedPlate, renavam }) ).to.be.true;
            });

            it( 'should remove dashes from plate', () => {
                let hide = sandbox.stub( $mdDialogMock, 'hide' );
                let plate = 'ovl-5905';
                let renavam = 222222222;
                let normalizedPlate = 'OVL5905';

                controller.ok( plate, renavam );

                expect( hide.calledWithExactly( { plate: normalizedPlate, renavam }) ).to.be.true;
            });
        });
    });
});
