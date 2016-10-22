import './login.component.css';
import template = require('./login.component.html');
import { LoginController } from './login.component.controller';

const directive = () => {
    return {
        template: template,
        controller: LoginController,
        restrict: 'E',
        controllerAs: 'vm', // scope: {},
        replace: true,
        bindToController: true
    };
};

export default directive;
