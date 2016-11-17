import { scrollWachDirective } from './scroll-watch.directive';
import { removeEmailValidationDirective } from './remove-email-validation.directive';
import { inputReturnDirective } from './input-return.directive';

export default angular.module( 'shared.directives', [] )
                      .directive( 'scrollWatch', scrollWachDirective )
                      .directive( 'removeEmailValidation', removeEmailValidationDirective )
                      .directive( 'inputReturn', inputReturnDirective );
