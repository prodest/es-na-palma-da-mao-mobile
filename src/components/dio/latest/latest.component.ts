import './latest.component.css';
import template = require('./latest.component.html');
import { LatestController } from './latest.component.controller';

const directive = () => {
    return {
        template: template,
        controller: LatestController,
        restrict: 'E',
        controllerAs: 'vm', // scope: {},
        replace: true,
        bindToController: true
    };
};

export default directive;