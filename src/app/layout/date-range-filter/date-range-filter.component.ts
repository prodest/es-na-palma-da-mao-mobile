import './date-range-filter.component.css';
import template = require( './date-range-filter.component.html' );
import { DateRangeFilterController } from './date-range-filter.component.controller';

const component = {
    template: template,
    controller: DateRangeFilterController,
    controllerAs: 'vm',
    bindings: {
        onChange: '&'
    }
};

export default component;