import './last-update.component.scss';

// tslint:disable
export const LastUpdateComponent: ng.IComponentOptions = {
	template: `<div ng-if="$ctrl.date" class="c-last-update">
					Atualizado em: {{$ctrl.date| date: 'dd/MM/yyyy HH:mm'}}h
			   </div>`,
	bindings: {
		date: '<'
	}
};

