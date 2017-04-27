import './search-bar.component.scss';
import template = require( './search-bar.component.html' );

// tslint:disable-next-line
export const SearchBarComponent: ng.IComponentOptions = {
    template: template,
    bindings: {
        icon: '@',
        placeholder: '@',
        onChange: '&',
        onBlur: '&',
        onFocus: '&',
        onClear: '&'
    }
};
