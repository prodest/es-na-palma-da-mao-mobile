import './toast.scss';
import { ToastController } from './toast.controller';
import { ToastService } from './toast.service';

export default angular.module( 'shared.toast', [] )
                      .service( 'toast', ToastService )
                      .controller( 'toastController', ToastController );


export * from './toast.controller';
export * from './toast.service';
export * from './models/index';