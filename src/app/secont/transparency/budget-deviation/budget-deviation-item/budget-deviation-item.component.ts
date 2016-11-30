import './budget-deviation-item.component.scss';

// tslint:disable
export const BudgetDeviationItemComponent: ng.IComponentOptions = {
    template: `<div class="bdi">
                    <div>
					    <div class="bdi-item-label" ng-if="$ctrl.item.label">{{$ctrl.item.label}}</div>
                        <div>
                            <div>Orçado: <span class="bdi-value">{{$ctrl.item.expected | currency}}</span></div>
                            <div>Executado: <span class="bdi-value">{{$ctrl.item.executed | currency}}</span></div>
                        </div>
					</div>
					<div class="bdi-percentage">
						{{$ctrl.item.percentage}}%
					</div>
                </div>`,
    bindings: {
        item: '<'
    }
};

       