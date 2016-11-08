import './signup.component.css';
import template = require('./signup.component.html');
import { SignUpController } from './signup.component.controller';

const directive = () => {
    return {
        template: template,
        controller: SignUpController,
        restrict: 'E',
        controllerAs: 'vm', // scope: {},
        replace: true,
        bindToController: true
    };
};

export default directive;
