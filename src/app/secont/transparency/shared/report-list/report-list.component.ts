import './report-list.component.scss';

// tslint:disable
export const ReportListComponent: ng.IComponentOptions = {
	template: `<md-list>
					<span ng-transclude="summarySlot"></span>
			   		<div ng-transclude="itemsSlot" class="rl" ng-class="{ asc: $ctrl.sort === 'asc' }"></div>
			   </md-list>`,
	transclude: {
      summarySlot: '?reportListSummary',
	  itemsSlot: 'reportListItem',
    },
	bindings: {
		sort: '<'
	}
};

