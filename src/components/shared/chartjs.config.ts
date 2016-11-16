
/**
 * Configura aspectos globais dos gráficos (https://jtblin.github.io/angular-chart.js/)
 * 
 * @export
 * @param {any} ChartJsProvider
 */
function charjsConfig( chartJsProvider ) {
     // configura proporção dos gráficos. Necessário à partir da versão 2.4.0 do chartjs
     chartJsProvider.setOptions({ pie: { aspectRatio: 2 } });
}

charjsConfig.$inject = [ 'ChartJsProvider' ];

export default charjsConfig;
