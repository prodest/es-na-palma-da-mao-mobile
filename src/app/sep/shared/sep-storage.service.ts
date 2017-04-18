import { AuthenticationService } from '../../security/security.module';
import { FavoriteProcessData } from './models/index';

/**
 * 
 * 
 * @export
 * @class CeturbStorage
 */
export class SepStorageService {

    public static $inject: string[] = [ '$localStorage', 'authenticationService' ];

    private favoriteProcessKey: string = 'FavoriteProcess';

    constructor( private $localStorage: any, private authenticationService: AuthenticationService ) {
    }

    public get favoriteProcess (): FavoriteProcessData {
        this.$localStorage[ this.favoriteProcessKey ] = this.$localStorage[ this.favoriteProcessKey ] || { favoriteProcess: [] };
        return this.$localStorage[ this.favoriteProcessKey ] as FavoriteProcessData;
    }

    public set favoriteProcess ( process: FavoriteProcessData ) {
        this.$localStorage[ this.favoriteProcessKey ] = process;
    }

    public get hasFavoriteProcess (): boolean {
        let favoriteProcess: FavoriteProcessData = this.$localStorage[ this.favoriteProcessKey ];
        if ( !!favoriteProcess ) {
            return ( '' + favoriteProcess.id ) === ( '' + this.authenticationService.user.sub ) && favoriteProcess.favoriteProcess && favoriteProcess.favoriteProcess.length > 0;
        } else {
            return false;
        }
    }

    public isFavoriteProcess ( processNumber: string ): boolean {
        return this.favoriteProcess.favoriteProcess.indexOf( processNumber ) !== -1;
    }

    public addToFavoriteProcess ( processNumber: string ): FavoriteProcessData {
        if ( !this.favoriteProcess.favoriteProcess ) {
            this.favoriteProcess.favoriteProcess = [];
        }
        this.favoriteProcess.favoriteProcess.splice( this.locationOf( processNumber, this.favoriteProcess.favoriteProcess ), 0, processNumber );
        return this.favoriteProcess;
    }

    public removeFromFavoriteProcess ( processNumber: string ): FavoriteProcessData {
        this.favoriteProcess.favoriteProcess = this.favoriteProcess.favoriteProcess.filter( p => p !== processNumber );
        return this.favoriteProcess;
    }

    private locationOf ( element: any, array: any[], start?: number, end?: number ) {
        start = start || 0;
        end = end === undefined ? array.length - 1 : end;
        let pivot = Math.floor(( start + end ) / 2 );
        if ( end < start || array[ pivot ] === element ) { return pivot + 1; };
        if ( array[ pivot ] < element ) {
            return this.locationOf( element, array, pivot + 1, end );
        } else {
            return this.locationOf( element, array, start, pivot - 1 );
        }
    }
}
