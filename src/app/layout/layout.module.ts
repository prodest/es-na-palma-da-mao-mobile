import errorMessageModule from './messages/error-message/index';
import remarkModule from './messages/remark/index';
import highlightModule from './messages/highlight/index';
import messageModule from './messages/message/index';
import spinnerModule from './spinner/index';
import menuModule from './menu/index';
import modalModule from './modal/index';
import dateRangeFilterModule from './date-range-filter/index';
import yearFilterModule from './year-filter/index';
import backButtonModule from './back-button/index';
import userInfoModule from './user-info/index';
import searchBarModule from './search-bar/index';

export default angular.module( 'layout', [
    errorMessageModule.name,
    messageModule.name,
    remarkModule.name,
    highlightModule.name,
    spinnerModule.name,
    menuModule.name,
    modalModule.name,
    dateRangeFilterModule.name,
    backButtonModule.name,
    userInfoModule.name,
    yearFilterModule.name,
    searchBarModule.name
] ).name;

export * from './date-range-filter/index';
export * from './year-filter/index';

