import './secure-warning.component.css';
import template = require('./secure-warning.component.html');
import { SecureWarningController } from './secure-warning.component.controller';

const directive = () => {
    return {
        template: template,
        controller: SecureWarningController,
        restrict: 'E',
        controllerAs: 'vm', // scope: {},
        replace: true,
        bindToController: true
    };
};

export default directive;
