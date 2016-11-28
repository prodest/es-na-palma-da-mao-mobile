import { AddLicenseController } from './add-license.controller';
import { $mdDialogMock, toastServiceMock } from '../../../shared/tests/index';

let expect = chai.expect;

describe( 'Detran/shared/add-license', () => {

    let sandbox: Sinon.SinonSandbox;
    beforeEach(() => sandbox = sinon.sandbox.create() );
    afterEach(() => sandbox.restore() );

    describe( 'Controller', () => {
        let controller: AddLicenseController;
        beforeEach(() => {
            controller = new AddLicenseController( $mdDialogMock, toastServiceMock );
        });

        describe( 'cancel()', () => {
            it( 'should cancel modal', () => {
                let cancel = sandbox.stub( $mdDialogMock, 'cancel' );

                controller.cancel();

                expect( cancel.called ).to.be.true;
            });
        });


        describe( 'ok(plate,renavam)', () => {
            it( 'should show validation message if no register number is provided', () => {
                let info = sandbox.stub( toastServiceMock, 'info' );

                controller.ok( '', '123234345' );
                expect( info.calledWithExactly( { title: 'Nº do registro é obrigatório' }) ).to.be.true;
            });

            it( 'should show validation message if no ballot is provided', () => {
                let info = sandbox.stub( toastServiceMock, 'info' );

                controller.ok( '123234345', '' );

                expect( info.calledWithExactly( { title: 'Nº da cédula é obrigatório' }) ).to.be.true;
            });


            it( 'should show validation message if register number is invalid', () => {
                let info = sandbox.stub( toastServiceMock, 'info' );

                controller.ok( '12323ddddddd', '1231231232' );

                expect( info.calledWithExactly( { title: 'Nº do registro deve conter somente números' }) ).to.be.true;
            });

            it( 'should show validation message if ballot is invalid', () => {
                let info = sandbox.stub( toastServiceMock, 'info' );

                controller.ok( '123234345', '1231232dffdfd' );

                expect( info.calledWithExactly( { title: 'Nº da cédula deve conter somente números' }) ).to.be.true;
            });

            it( 'should close modal passing added license', () => {
                let hide = sandbox.stub( $mdDialogMock, 'hide' );
                let registerNumber = '1111111111';
                let ballot = '222222222';

                controller.ok( registerNumber, ballot );

                expect( hide.calledWith( { registerNumber, ballot }) ).to.be.true;
            });
        });
    });
});
