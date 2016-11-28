import { DialogService } from './dialog.service';

export default angular.module( 'shared.dialog', [] )
                      .service( 'dialog', DialogService );

export * from './dialog.service';
