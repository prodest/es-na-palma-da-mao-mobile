import errorMessageModule from './messages/error-message/index';
import remarkModule from './messages/remark/index';
import highlightModule from './messages/highlight/index';
import messageModule from './messages/message/index';
import spinnerModule from './spinner/index';
import menuModule from './menu/index';
import secureWarningModule from './secure-warning/index';
import backButtonModule from './back-button/index';

export default angular.module( 'layout', [
    errorMessageModule.name,
    messageModule.name,
    remarkModule.name,
    highlightModule.name,
    spinnerModule.name,
    menuModule.name,
    secureWarningModule.name,
    backButtonModule.name
] );