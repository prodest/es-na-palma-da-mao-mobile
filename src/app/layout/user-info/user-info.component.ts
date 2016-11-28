import './user-info.component.css';
import template = require( './user-info.component.html' );


// tslint:disable-next-line
export const UserInfoComponent: ng.IComponentOptions = {
    template: template,
    bindings: {
        user: '<'
    }
};

