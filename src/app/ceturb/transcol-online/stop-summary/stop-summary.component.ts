import './stop-summary.component.scss';
import template = require( './stop-summary.component.html' );
// tslint:disable
export const StopSummaryComponent: ng.IComponentOptions = {
    template: template,
    bindings: {
        stop: '<',
        onStopClick: '&'
    }
};
