import { <%= upCaseName %>Controller } from './<%= name %>.component.controller';
import { <%= upCaseName %>Component } from './<%= name %>.component';
import <%= upCaseName %>Template = require( './<%= name %>.component.html' );
import { environment } from '../shared/tests/index';

let expect = chai.expect;

describe( '<%= upCaseName %>', () => {

    let sandbox: Sinon.SinonSandbox;
    beforeEach(() => sandbox = sinon.sandbox.create() );
    afterEach(() => sandbox.restore() );

    describe( 'Controller', () => {
        let controller: <%= upCaseName %>Controller;
        beforeEach(() => {
            environment.refresh();
            controller = new <%= upCaseName %>Controller( environment.$scope );
        });
    });


    describe( 'Component', () => {
        // test the component/directive itself
        let component = <%= upCaseName %>Component();

        it( 'should use the right controller', () => {
            expect( component.controller ).to.equal( <%= upCaseName %>Controller );
        });

        it( 'should use the right template', () => {
            expect( component.template ).to.equal( <%= upCaseName %>Template );
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
