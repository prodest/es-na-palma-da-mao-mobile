import './search.component.css';
import template = require('./search.component.html');
import { SearchController } from './search.component.controller';

const directive = () => {
    return {
        template: template,
        controller: SearchController,
        restrict: 'E',
        controllerAs: 'vm', // scope: {},
        replace: true,
        bindToController: true
    };
};

export default directive;