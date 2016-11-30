import './error-message.component.scss';
import template = require('./error-message.component.html');
import { ErrorMessageController } from './error-message.component.controller';

const directive = () => {
    return {
        template: template,
        transclude: true,
        controller: ErrorMessageController,
        restrict: 'E',
        controllerAs: 'vm',
        replace: false,
        scope: true,
        bindToController: {
            error: '=',
            unhandledErrorMessage: '@'
        }
    };
};

export default directive;