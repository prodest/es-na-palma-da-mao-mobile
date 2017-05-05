import './favorites-slider.component.scss';
import template = require( './favorites-slider.component.html' );
// tslint:disable
export const FavoritesSliderComponent: ng.IComponentOptions = {
    template: template,
    bindings: {
        favorites: '<',
        onFavoriteClick: '&'
    }
};
