import './user-info.component.scss';
import template = require( './user-info.component.html' );


// tslint:disable-next-line
export const UserInfoComponent: ng.IComponentOptions = {
    template: template,
    bindings: {
        user: '<'
    }
};

