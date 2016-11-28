import { TicketColorService } from './ticket-color.service';

let expect = chai.expect;

describe( 'TicketColorService', () => {

    let sandbox: Sinon.SinonSandbox;
    beforeEach(() => sandbox = sinon.sandbox.create() );
    afterEach(() => sandbox.restore() );

    let ticketColorService: TicketColorService;
    let levelsTable = [
        { name: 'leve', color: 'green' },
        { name: 'média', color: 'yellow' },
        { name: 'media', color: 'yellow' },
        { name: 'grave', color: 'red' },
        { name: 'gravíssima', color: 'black' },
        { name: 'gravissima', color: 'black' }
    ];

    beforeEach(() => {
        ticketColorService = new TicketColorService();
    });

    describe( 'getTicketLevelColor()', () => {
        it( 'should return level colors correctly', () => {
            levelsTable.forEach( level => {
                let color = ticketColorService.getTicketLevelColor( level.name );
                expect( color ).to.be.equal( level.color );
            } );
        });

        it( 'should return "" with if level name is founded', () => {
            let color = ticketColorService.getTicketLevelColor( 'level inexistente' );
            expect( color ).to.be.not.undefined;
            expect( color ).to.be.equal( '' );
        });
    });
});

