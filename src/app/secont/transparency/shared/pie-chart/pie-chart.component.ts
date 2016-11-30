import './pie-chart.component.scss';

// tslint:disable
export const PieChartComponent: ng.IComponentOptions = {
	template: `<div>
				<canvas class="chart chart-pie" 
					chart-options="{animation:{ duration: 0}}" 
					chart-data="$ctrl.data.values"
					chart-labels="$ctrl.data.labels"
					chart-colors="$ctrl.data.colors">
				</canvas>
			</div>`,
	bindings: {
		type: '<',
		data: '<',
		options: '<'
	}
};

