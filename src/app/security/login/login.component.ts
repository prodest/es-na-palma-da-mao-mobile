import './login.component.scss';
import template = require('./login.component.html');
import { LoginController } from './login.component.controller';

// tslint:disable-next-line
export const LoginComponent = () => {
    return {
        template: template,
        controller: LoginController,
        restrict: 'E',
        controllerAs: 'vm', // scope: {},
        replace: true,
        bindToController: true
    };
};

export default LoginComponent;
