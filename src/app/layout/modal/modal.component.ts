import { IRootScopeService, IRootElementService } from 'angular';

modalComponent.$inject = [ '$rootScope', '$ionicModal' ];

/**
 * Ref: https://gist.github.com/mlegenhausen/1043c6d12bc596032e3f
 * 
 * @export
 * @param {IRootScopeService} $rootScope
 * @param {ionic.modal.IonicModalService} $ionicModal
 * @returns
 */
export function modalComponent( $rootScope: IRootScopeService, $ionicModal: ionic.modal.IonicModalService ) {
    return {
        restrict: 'E',
        scope: {
            animation: '@',
            show: '=',
            title: '@'
        },
        compile: compile
    };


    /**
     * 
     * 
     * @param {any} scope
     * @param {any} element
     * @returns
     */
    function buildTemplate( scope, element ) {
        // Get original html code before angular processes it
        const innerTemplate = element.children()[ 0 ].outerHTML;

        /* tslint:disable */
        let modalTemplate = `<ion-modal-view>
				<ion-header-bar align-title="center" class="material-background-nav-bar capitalize">
					<div class="title">
						<span class="nav-bar-title">
							${scope.title}
						</span>
					</div>
					<div class="buttons buttons-right" style="transition-duration: 0ms;">
						<span class="right-buttons">
							<md-button class="md-icon-button" ng-click="vm.showFilter=false">
								<md-icon md-font-icon="ion-close"></md-icon>
							</md-button>
						</span>
					</div>
				</ion-header-bar>
				<ion-content>
                    <INNER-MODAL-TEMPLATE>
				</ion-content>
			</ion-modal-view>`;
        /* tslint:enable */
        element.empty();

        return modalTemplate.replace( '<INNER-MODAL-TEMPLATE>', innerTemplate );
    }

    /**
     * 
     * 
     * @param {any} element
     * @returns
     */
    function compile( element: IRootElementService ) {
        return scope => {

            const template = buildTemplate( scope, element );

            const modal = $ionicModal.fromTemplate( template, {
                scope: scope.$parent,
                animation: scope.animation
            });

            let watchFn = scope.$watch( 'show', show => modal[ show ? 'show' : 'hide' ]() );

            // Listen to scope destroy events
            scope.$on( '$destroy', () => {
                $rootScope.$on( '$ionicView.beforeLeave', () => modal.hide() );
                modal.remove();
                watchFn();
            });
        };
    }
}
