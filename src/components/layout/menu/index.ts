import menuComponent from './menu.component';
import detranShared from '../../detran/shared/index';
import drawer from '../drawer/index';

export default angular.module( 'layout.menu', [ detranShared.name, drawer.name ] )
                      .directive( 'menu', menuComponent );

