import './report.component.css';
import template = require( './report.component.html' );
import { ReportController } from './report.component.controller';

export default {
    template: template,
    controller: ReportController,
    controllerAs: 'vm',
    bindings: {
        summary: '<',
        title: '<',
        showChart: '=',
        showInfo: '=',
        onItemClick: '&'
    }
};