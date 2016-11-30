import './money-flow-report.component.scss';
import template = require( './money-flow-report.component.html' );
import { MoneyFlowReportController } from './money-flow-report.component.controller';

// tslint:disable-next-line
export const MoneyFlowReportComponent: ng.IComponentOptions = {
    template: template,
    controller: MoneyFlowReportController,
    bindings: {
        moneyFlow: '<',
        title: '<',
        showChart: '<',
        showInfo: '<',
        onItemClick: '&'
    }
};