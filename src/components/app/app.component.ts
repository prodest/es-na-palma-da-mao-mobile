import template = require('./app.component.html');
import './app.component.css';

let appComponent = () => {
    return {
        template, // because we have a variable name template we can use the shorcut here
        restrict: 'E'
        // scope: {}
    };
};

export default appComponent;
