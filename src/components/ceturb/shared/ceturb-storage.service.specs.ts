import { CeturbStorage } from './ceturb-storage.service';
import { AuthenticationService } from '../../shared/authentication/index';

let expect = chai.expect;

describe( 'CeturbStorage', () => {

    let sandbox: Sinon.SinonSandbox;
    beforeEach(() => sandbox = sinon.sandbox.create() );
    afterEach(() => sandbox.restore() );

    let ceturbStorage: CeturbStorage;
    let $localStorage: any;
    let authenticationService: AuthenticationService;

    beforeEach(() => {
        $localStorage = {};
        authenticationService = <AuthenticationService><any>{
            user: {
                cfp: '12345678912',
                cnhNumero: '77777777777',
                cnhCedula: '88888888888'
            }
        };
        ceturbStorage = new CeturbStorage( $localStorage, authenticationService );

        ceturbStorage.favoriteLines = { id: 9232, favoriteLines: [ '678', '400' ], date: new Date() };
    });

    describe( 'isFavoriteLine(line)', () => {
        it( 'should be true if line number matches some already storaged line', () => {
            expect( ceturbStorage.isFavoriteLine( '678' ) ).to.be.true;
            expect( ceturbStorage.isFavoriteLine( '555' ) ).to.be.false;
        });
    });

    describe( 'removeFromFavoriteLines(line)', () => {
        it( 'should remove line if line number matches any stored line', () => {
            let lineNumber = '678';
            let favoriteLines = ceturbStorage.removeFromFavoriteLines( lineNumber );
            expect( favoriteLines.favoriteLines ).to.not.contain( lineNumber );
        });

        it( 'should not remove line if line number does not match any stored line', () => {
            let lineNumber = '999';
            let favoriteLines = ceturbStorage.removeFromFavoriteLines( lineNumber );
            expect( favoriteLines.favoriteLines ).to.not.contain( lineNumber );
        });
    });


    describe( 'addToFavoriteLines(line)', () => {
        it( 'should add line to favorite lines', () => {
            let newLine = '777';
            let favoriteLines = ceturbStorage.addToFavoriteLines( newLine );
            expect( favoriteLines.favoriteLines ).to.contain( newLine );
        });
    });
});

