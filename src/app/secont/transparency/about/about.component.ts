import './about.component.css';
import template = require( './about.component.html' );

// tslint:disable-next-line
export const AboutComponent = () => {
    return {
        template: template,
        restrict: 'E',
        replace: true,
        bindToController: false
    };
};

