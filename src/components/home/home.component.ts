import './home.component.css';
import template = require('./home.component.html');
import { HomeController } from './home.component.controller';

const directive = () => {
    return {
        template: template,
        controller: HomeController,
        restrict: 'E',
        controllerAs: 'vm', // scope: {},
        replace: true,
        bindToController: true
    };
};

export default directive;
