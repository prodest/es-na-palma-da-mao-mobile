import './report-list-item.component.scss';

// tslint:disable
export const ReportListItemComponent: ng.IComponentOptions = {
	template: `<md-list-item class="r-item" ng-transclude></md-list-item>
			   <md-divider></md-divider>`,
	transclude: true
};

