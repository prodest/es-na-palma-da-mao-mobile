import './news-detail.component.css';
import template = require('./news-detail.component.html');
import { NewsDetailController } from './news-detail.component.controller';

// tslint:disable-next-line
export const NewsDetailComponent = () => {
    return {
        template: template,
        controller: NewsDetailController,
        restrict: 'E',
        controllerAs: 'vm', // scope: {},
        replace: true,
        bindToController: true
    };
};




