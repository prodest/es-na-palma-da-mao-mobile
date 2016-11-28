
/**
 * Configura aspectos globais dos gráficos (https://jtblin.github.io/angular-chart.js/)
 * 
 * @export
 * @param {any} ChartJsProvider
 */
function charjsConfig( chartJsProvider ) {

    const horizontalBarCharConfig = {
        scales: {
            yAxes: [ { gridLines: { display: false } }],
            xAxes: [ {
                display: false,
                ticks: {
                    min: 0,
                    max: 105
                },
                gridLines: {
                    display: false
                }
            }]
        }
    };

    chartJsProvider.setOptions( {
        animation: { duration: 0 },
        pie: { aspectRatio: 2 },  // configura proporção dos gráficos. Necessário à partir da versão 2.4.0 do chartjs
        horizontalBar: horizontalBarCharConfig,
        legend: { display: false }
    });
}

charjsConfig.$inject = [ 'ChartJsProvider' ];

export default charjsConfig;
