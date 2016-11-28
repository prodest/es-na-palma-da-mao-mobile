import { BackButtonController } from './back-button.component.controller';

// tslint:disable-next-line
export const backButtonComponent: ng.IComponentOptions = {
    controller: BackButtonController,
    template: `<a ng-click="$ctrl.goBack()" class="button back-button buttons button-clear header-item nav-back-btn">
            <i class="ion-android-arrow-back"></i>
        </a>`
};

