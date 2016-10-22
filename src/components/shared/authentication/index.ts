
import { AuthenticationService } from './authentication.service';
import { AuthenticationStorageService } from './authentication-storage.service';
import { AcessoCidadaoService } from './acesso-cidadao.service';
import { DigitsService } from './digits.service';

export default angular
    .module( 'authentication.shared', [] )
    .service( 'acessoCidadaoService', AcessoCidadaoService )
    .service( 'digitsService', DigitsService )
    .service( 'authenticationService', AuthenticationService )
    .service( 'authenticationStorageService', AuthenticationStorageService );

export * from './acesso-cidadao.service';
export * from './digits.service';
export * from './models/index';
export * from './authentication.service';
export * from './authentication-storage.service';
