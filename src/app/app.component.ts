import template = require('./app.component.html');
import { AppController } from './app.component.controller';
import './app.component.scss';

// tslint:disable-next-line
export const AppComponent = () => {
    return {
        template, // because we have a variable name template we can use the shorcut here
        controller: AppController,
        restrict: 'E',
        controllerAs: '$ctrl', // scope: {},
        replace: true,
        bindToController: true
    };
};

