import './news-list.component.css';
import template = require('./news-list.component.html');
import { NewsListController } from './news-list.component.controller';

// tslint:disable-next-line
export const NewsListComponent = () => {
    return {
        template: template,
        controller: NewsListController,
        restrict: 'E',
        controllerAs: 'vm', // scope: {},
        replace: true,
        bindToController: true
    };
};

