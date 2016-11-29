/*
 eslint
 no-undef: 0,
 dot-notation: 0,
 angular/di: 0,
 no-unused-expressions: 0
 */
import { SepApiService } from './sep-api.service';
import { settings } from '../../shared/shared.module';
import { $httpMock } from '../../shared/tests/index';

let expect = chai.expect;

describe( 'SepApiService', () => {

    let sandbox;
    beforeEach(() => sandbox = sinon.sandbox.create() );
    afterEach(() => sandbox.restore() );

    let sepApiService;
    let processNumber = 68985037;
    let $httpGet: Sinon.SinonStub;

    beforeEach(() => {
        $httpGet = sandbox.stub( $httpMock, 'get' );
        sepApiService = new SepApiService( $httpMock, settings );
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe( 'getProcessByNumber( processNumber )', () => {

        it( 'should call sep api endpoint with process number', () => {
            $httpGet.returnsPromise();

            sepApiService.getProcessByNumber( processNumber );

            expect( $httpGet.calledWith( settings.api.sep + '/' + processNumber ) ).to.be.true;
        });

        it( 'should normalize response to response.data property', () => {
            let response = {
                data: {
                    number: '68985037',
                    parts: [
                        'PRODEST - GEREH'
                    ],
                    subject: 'AUTORIZACAO',
                    summary: 'PEDIDO DE AUTORIZAÇÃO DE SUBSTITUIÇÃO DO GERENTE DA GESIN - GERÊNCIA DE SISTEMAS.',
                    status: 'EM ANDAMENTO',
                    updates: [
                        {
                            date: '14/01/2015 11:31:40',
                            agency: 'INSTITUTO DE TECNOLOGIA DE INFORMACAO E COMUNICACAO DO ESTADO DO ESPIRITO SANTO',
                            area: 'GERENCIA DE ADMINISTRACAO GERAL',
                            status: 'AUTUADO'
                        }
                    ],
                    district: 'VITÓRIA',
                    extra: 'GEREH'
                }
            };

            $httpGet.returnsPromise().resolves( response );

            sepApiService.getProcessByNumber( processNumber ).then(( process ) => {
                expect( process ).to.deep.equal( response.data );
            });
        });
    });
});

