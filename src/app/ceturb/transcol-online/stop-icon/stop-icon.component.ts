import './stop-icon.component.scss';
import template = require( './stop-icon.component.html' );
// tslint:disable
export const StopIconComponent: ng.IComponentOptions = {
    template: template,
    bindings: {
        stop: '<'
    }
};
