import './about.component.css';
import template = require('./about.component.html');
import { AboutController } from './about.component.controller';

const directive = () => {
    return {
        template: template,
        controller: AboutController,
        restrict: 'E',
        controllerAs: 'vm',
        replace: true,
        bindToController: true
    };
};

export default directive;