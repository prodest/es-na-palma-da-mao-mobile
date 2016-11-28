
import { PushService } from './push.service';

export default angular.module( 'shared.push', [ /*'authentication.shared'*/ ] )
                      .service( 'pushService', PushService );

export * from './push.service';
export * from './models/index';
