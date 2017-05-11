import './feedback-form.component.scss';
import template = require( './feedback-form.component.html' );
import { FeedbackFormController } from './feedback-form.component.controller';
// tslint:disable
export const FeedbackFormComponent: ng.IComponentOptions = {
    template: template,
    controller: FeedbackFormController,
    controllerAs: 'vm',
    bindings: {
        showStop: '<',
        showLine: '<',
        showTime: '<',
        getLocation: '<',
        showText: '<',
        onSendFeedback: '&'
    }
};
