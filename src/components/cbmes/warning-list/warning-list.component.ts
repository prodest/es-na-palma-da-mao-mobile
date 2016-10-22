import './warning-list.component.css';
import template = require('./warning-list.component.html');
import { WarningListController } from './warning-list.component.controller';

const directive = () => {
    return {
        template: template,
        controller: WarningListController,
        restrict: 'E',
        controllerAs: 'vm', // scope: {},
        replace: true,
        bindToController: true
    };
};

export default directive;
