import './about.component.scss';
import template = require( './about.component.html' );
import { TransparencyAboutController } from './about.component.controller';

// tslint:disable-next-line
export const AboutComponent = () => {
    return {
        template: template,
        controller: TransparencyAboutController,
        restrict: 'E',
        replace: true,
        controllerAs: 'vm',
        bindToController: true
    };
};

