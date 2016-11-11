import reportComponent from './report/report.component';
import { TransparencyService } from './transparency.service';

export default angular.module( 'graph.shared', [] )
    .service( 'transparencyService', TransparencyService )
    .component( 'report', reportComponent );

export * from './transparency.service';
export * from './models/index';
export * from './money-flow.controller';
export * from './money-flow-detail.controller';