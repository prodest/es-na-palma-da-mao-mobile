import './sep-consulta.component.css';
import template = require('./sep-consulta.component.html');
import { SepConsultaController } from './sep-consulta.component.controller';

// tslint:disable-next-line
export const SepConsultaComponent = () => {
    return {
        template: template,
        controller: SepConsultaController,
        restrict: 'E',
        controllerAs: 'vm', // scope: {},
        replace: true,
        bindToController: true
    };
};

