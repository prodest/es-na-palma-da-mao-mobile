import { CeturbStorage } from './ceturb-storage.service';
import { AuthenticationService } from '../../security/security.module';

let expect = chai.expect;

describe( 'CeturbStorage', () => {

    let sandbox: Sinon.SinonSandbox;
    beforeEach(() => sandbox = sinon.sandbox.create() );
    afterEach(() => sandbox.restore() );

    // SUT 
    let ceturbStorage: CeturbStorage;

    beforeEach(() => {
        const $localStorage = {};
        const authenticationService = <AuthenticationService>{};
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

