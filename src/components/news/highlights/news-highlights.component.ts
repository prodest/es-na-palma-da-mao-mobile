import './news-highlights.component.css';
import template = require('./news-highlights.component.html');
import { NewsHighlightsController } from './news-highlights.component.controller';

const directive = () => {
    return {
        template: template,
        controller: NewsHighlightsController,
        restrict: 'E',
        controllerAs: 'vm', // scope: {},
        replace: true,
        bindToController: true
    };
};

export default directive;
