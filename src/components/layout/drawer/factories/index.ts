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
    .service( '$nlHelpers', NlHelpers )
    .service( '$nlElements', NlElements )
    .service( '$nlConfig', NlConfig )
    .service( '$nlBurger', NlBurger )
    .service( '$nlDrawer', NlDrawer )
    .service( '$nlRefresh', NlRefresh )
    .service( '$nlToast', NlToast )
    .service( '$nlMenu', NlMenu )
    .service( '$nlFab', NlFab  )
    .service( '$nlFramework', NlFramework );

export * from './nl-framework.factory';
