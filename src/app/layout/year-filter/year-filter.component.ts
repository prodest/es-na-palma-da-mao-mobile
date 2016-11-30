import './year-filter.component.scss';
import template = require( './year-filter.component.html' );
import { YearFilterController } from './year-filter.component.controller';

// tslint:disable-next-line
export const YearFilterComponent = {
    template: template,
    controller: YearFilterController,
    bindings: {
        onChange: '&'
    }
};