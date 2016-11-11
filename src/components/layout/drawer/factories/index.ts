import { NlFramework } from './nl-framework.factory';
import { NlElements } from './nl-elements.factory';
import { NlConfig } from './nl-config.factory';
import { NlHelpers } from './nl-helpers.factory';
import { NlBurger } from './nl-burguer.factory';
import { NlDrawer } from './nl-drawer.factory';
import { NlRefresh } from './nl-refresh.factory';
import { NlToast } from './nl-toast.factory';
import { NlMenu } from './nl-menu.factory';
import { NlFab } from './nl-fab.factory';

let dependencies = [];

export default angular.module( 'drawer-menu', dependencies )
    .factory( '$nlFramework', [ '$nlConfig', '$nlDrawer', '$nlBurger', '$nlRefresh', '$nlToast', '$nlMenu', '$nlFab', '$nlHelpers', '$nlElements', NlFramework ] )
    .factory( '$nlElements', NlElements )
    .factory( '$nlConfig', NlConfig)
    .factory( '$nlHelpers', NlHelpers )
    .factory( '$nlBurger', [ '$nlConfig', '$nlHelpers', '$nlElements', NlBurger ] )
    .factory( '$nlDrawer', [ '$nlConfig', '$nlBurger', '$nlHelpers', '$nlElements', '$nlFab', NlDrawer ] )
    .factory( '$nlRefresh', [ '$nlConfig', '$nlHelpers', '$nlElements', NlRefresh ] )
    .factory( '$nlToast', [ '$nlConfig', '$nlHelpers', '$nlElements', NlToast ] )
    .factory( '$nlMenu', [ '$nlConfig', '$nlHelpers', '$nlElements', NlMenu ] )
    .factory( '$nlFab', [ '$nlConfig', '$nlHelpers', '$nlElements', NlFab ] );

export * from './nl-framework.factory';