import reportComponent from './report/report.component';
import { TransparencyApiService } from './transparency-api.service';

export default angular.module( 'graph.shared', [] )
    .service( 'transparencyApiService', TransparencyApiService )
    .component( 'report', reportComponent );

export * from './transparency-api.service';
export * from './models/index';
export * from './money-flow.controller';
export * from './money-flow-detail.controller';