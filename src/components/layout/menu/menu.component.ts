import './menu.component.css';
import template = require('./menu.component.html');
import MenuController from './menu.component.controller';

const directive = () => {
    return {
        template: template,
        controller: MenuController,
        restrict: 'E',
        controllerAs: 'vm', // scope: {},
        replace: true,
        bindToController: true
    };
};

export default directive;
