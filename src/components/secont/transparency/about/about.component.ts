import './about.component.css';
import template = require( './about.component.html' );

const directive = () => {
    return {
        template: template,
        restrict: 'E',
        replace: true,
        bindToController: false
    };
};

export default directive;
