import './report-title.component.css';

// tslint:disable
export const ReportTitleComponent: ng.IComponentOptions = {
    template: `<md-subheader class="rt report-part" ng-if="$ctrl.title">
					<span style="flex:1">{{$ctrl.title}}</span>
					<md-btn class="md-icon-btn rt-btn rt-btn-info" ng-click="$ctrl.showInfo = !$ctrl.showInfo">
						<md-icon md-font-icon="fa fa-info-circle">
						</md-icon>
					</md-btn>
				</md-subheader>
				<md-subheader ng-if="$ctrl.showInfo" class="rt-info">
					{{$ctrl.info}}
				</md-subheader>`,
    bindings: {
        title: '<',
        showInfo: '<',
        info: '<'
    }
};

