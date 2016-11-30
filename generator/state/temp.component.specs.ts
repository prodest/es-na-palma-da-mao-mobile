import { <%= className %>Controller } from './<%= fileName %>.component.controller';
import { <%= className %>Component } from './<%= fileName %>.component';
import <%= className %>Template = require( './<%= fileName %>.component.html' );
import { environment } from '../shared/tests/index';

let expect = chai.expect;

describe( '<%= className %>', () => {

    let sandbox: Sinon.SinonSandbox;
    beforeEach(() => sandbox = sinon.sandbox.create() );
    afterEach(() => sandbox.restore() );

    describe( 'Controller', () => {
        let controller: <%= className %>Controller;
        beforeEach(() => {
            environment.refresh();
            controller = new <%= className %>Controller( environment.$scope );
        });
    });


    describe( 'Component', () => {
        // test the component/directive itself
        let component = <%= className %>Component();

        it( 'should use the right controller', () => {
            expect( component.controller ).to.equal( <%= className %>Controller );
        });

        it( 'should use the right template', () => {
            expect( component.template ).to.equal( <%= className %>Template );
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
