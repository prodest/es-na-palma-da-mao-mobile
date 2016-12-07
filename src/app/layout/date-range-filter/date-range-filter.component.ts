import './date-range-filter.component.scss';
import template = require( './date-range-filter.component.html' );
import { DateRangeFilterController } from './date-range-filter.component.controller';

const component = {
    template: template,
    controller: DateRangeFilterController,
    controllerAs: 'vm',
    bindings: {
        onChange: '&',
        value: '<'
    }
};

export default component;