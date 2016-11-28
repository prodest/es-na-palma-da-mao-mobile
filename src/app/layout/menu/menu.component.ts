import './menu.component.css';
import template = require( './menu.component.html' );
import MenuController from './menu.component.controller';


// tslint:disable-next-line
export const MenuComponent: ng.IComponentOptions = {
    template: template,
    controller: MenuController,
    bindings: {
        menu: '<',
        user: '<',
        onCloseButtonClick: '&',
        onItemClick: '&',
        onHomeClick: '&',
        onLogoutClick: '&'
    }
};

