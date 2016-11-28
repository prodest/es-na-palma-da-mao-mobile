import './report-list-summary.component.css';
import template = require( './report-list-summary.component.html' );
import { ReportListSummaryController } from './report-list-summary.component.controller';

// tslint:disable
export const ReportListSummaryComponent: ng.IComponentOptions = {
	controller: ReportListSummaryController,
	template: template,
	transclude: true,
	bindings: {
		onSortClick: '&'
	}
};

