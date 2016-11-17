import framework from './factories/index';
import DrawerComponent from './drawer.component';

const dependencies = [ framework.name ];

export default angular.module( 'drawer', dependencies )
                    .directive( 'drawerComponent', DrawerComponent );

export * from './factories/index';
