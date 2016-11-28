
import { CordovaPermissions } from './cordova-permissions';

export default angular.module( 'shared.permissions', [] )
                      .service( 'cordovaPermissions', CordovaPermissions );

export * from './cordova-permissions';
