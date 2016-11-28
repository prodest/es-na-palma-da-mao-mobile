import { SepConsultaComponent } from './sep-consulta.component';
import { SepApiService } from './shared/index';

export default angular.module( 'sep.module', [] )

    // services
    .service( 'sepApiService', SepApiService )

    // components
    .directive( 'sepConsulta', SepConsultaComponent )

    // routes
    .config( [
        '$stateProvider', ( $stateProvider ) => {
            $stateProvider
                .state( 'app.sepConsulta/:processNumber', {
                    url: 'sepConsulta/:processNumber',
                    data: { title: 'Consulta SEP' },
                    views: {
                        content: {
                            template: '<sep-consulta></sep-consulta>'
                        }
                    }
                });
        }
    ] ).name;
