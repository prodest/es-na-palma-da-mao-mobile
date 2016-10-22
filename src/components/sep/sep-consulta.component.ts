import './sep-consulta.component.css';
import template = require('./sep-consulta.component.html');
import { SepConsultaController } from './sep-consulta.component.controller';

const directive = () => {
    return {
        template: template,
        controller: SepConsultaController,
        restrict: 'E',
        controllerAs: 'vm', // scope: {},
        replace: true,
        bindToController: true
    };
};

export default directive;
