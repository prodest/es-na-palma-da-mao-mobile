import './feedback.component.scss';
import template = require( './feedback.component.html' );
import { TranscolFeedbackController } from './feedback.component.controller';

// tslint:disable-next-line
export const TranscolFeedBackComponent = () => {
    return {
        template: template,
        controller: TranscolFeedbackController,
        restrict: 'E',
        replace: true,
        controllerAs: 'vm',
        bindToController: true
    };
};
