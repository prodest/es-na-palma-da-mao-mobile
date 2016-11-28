import { SourcesFilterController } from './sources-filter.controller';
import { $mdDialogMock } from '../../shared/tests/index';
let expect = chai.expect;

describe( 'News/news-list/sources-filter', () => {

    let sandbox: Sinon.SinonSandbox;
    beforeEach(() => sandbox = sinon.sandbox.create() );
    afterEach(() => sandbox.restore() );

    describe( 'Controller', () => {
        let controller: SourcesFilterController;
        beforeEach(() => {
            controller = new SourcesFilterController( $mdDialogMock );
        });

        describe( 'on instantiation', () => {
            it( 'should have a undefined selected origins', () => {
                expect( controller.selectedOrigins ).to.be.undefined;
            });

            it( 'should have a undefined list of available origins', () => {
                expect( controller.availableOrigins ).to.be.undefined;
            });
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
                let selectedOrigins = [ 'SESA', 'SEDU' ];

                controller.ok( selectedOrigins );

                expect( hide.calledWith( { origins: selectedOrigins }) ).to.be.true;
            });
        });


        describe( 'isAllChecked()', () => {
            it( 'should be true if all available origins are selected', () => {
                controller.selectedOrigins = controller.availableOrigins = [ 'SESA', 'SEDU' ];

                expect( controller.isAllChecked() ).to.be.true;
            });

            it( 'should be false if some, but not all available origins are selected', () => {
                controller.availableOrigins = [ 'SESA', 'SEDU' ];
                controller.selectedOrigins = controller.availableOrigins[ 0 ];

                expect( controller.isAllChecked() ).to.be.false;
            });

            it( 'should be false if there is no selected origins', () => {
                controller.availableOrigins = [ 'SESA', 'SEDU' ];
                controller.selectedOrigins = [];

                expect( controller.isAllChecked() ).to.be.false;
            });
        });

        describe( 'isIndeterminate()', () => {
            it( 'should be true if some, but not all available origins are selected', () => {
                controller.availableOrigins = [ 'SESA', 'SEDU' ];
                controller.selectedOrigins = controller.availableOrigins[ 0 ];

                expect( controller.isIndeterminate() ).to.be.true;
            });

            it( 'should be false if there is no selected origins', () => {
                controller.availableOrigins = [ 'SESA', 'SEDU' ];
                controller.selectedOrigins = [];

                expect( controller.isIndeterminate() ).to.be.false;
            });
        });


        describe( 'toggleAllChecked()', () => {
            it( 'should unselect all origins, if all is selected', () => {
                controller.selectedOrigins = controller.availableOrigins = [ 'SESA', 'SEDU' ];

                controller.toggleAllChecked();

                expect( controller.selectedOrigins ).to.be.deep.equal( [] );
            });

            it( 'should select all available origins, if some is selected', () => {
                controller.availableOrigins = [ 'SESA', 'SEDU' ];
                controller.selectedOrigins = controller.availableOrigins[ 0 ];

                controller.toggleAllChecked();

                expect( controller.selectedOrigins ).to.be.deep.equal( controller.availableOrigins );
            });

            it( 'should select all available origins, if none is selected', () => {
                controller.availableOrigins = [ 'SESA', 'SEDU' ];
                controller.selectedOrigins = [];

                controller.toggleAllChecked();

                expect( controller.selectedOrigins ).to.be.deep.equal( controller.availableOrigins );
            });
        });

        describe( 'toggleChecked(origin)', () => {
            it( 'should select an available origin, if it is not selected', () => {
                controller.availableOrigins = [ 'SESA', 'SEDU' ];
                controller.selectedOrigins = [ 'SESA' ];

                controller.toggleChecked( 'SEDU' );

                expect( controller.selectedOrigins ).to.contain( 'SEDU' );
            });

            it( 'should unselect an origin, if it is selected', () => {
                controller.selectedOrigins = controller.availableOrigins = [ 'SESA', 'SEDU' ];

                controller.toggleChecked( 'SESA' );

                expect( controller.selectedOrigins ).to.not.contain( 'SESA' );
            });
        });


        describe( 'isSelected(origin)', () => {
            it( 'should return true if provided origin is selected', () => {
                controller.selectedOrigins = [ 'SESA', 'SEDU' ];

                controller.selectedOrigins.forEach( origin => {
                    expect( controller.isSelected( origin ) ).to.be.true;
                });
            });

            it( 'should return false if provided origin is not selected', () => {
                controller.selectedOrigins = [ 'SESA', 'SEDU' ];

                [ 'SECOM', 'PRODEST' ].forEach( origin => {
                    expect( controller.isSelected( origin ) ).to.be.false;
                });
            });
        });
    });
});
