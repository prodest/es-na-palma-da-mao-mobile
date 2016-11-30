import './horizontal-bar-chart.component.scss';

// tslint:disable
export const HorizontalBarChartComponent: ng.IComponentOptions = {
	template: `<div>
				<canvas class="chart chart-horizontal-bar" 
					chart-options="$ctrl.options" 
					chart-data="$ctrl.data.values"
					chart-labels="$ctrl.data.labels"
					chart-colors="$ctrl.data.colors"
					chart-dataset-override="$ctrl.data.override">
				</canvas>
			</div>`,
	bindings: {
		data: '<',
		options: '<'
	}
};

