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
        this.favoriteProcess.favoriteProcess.push( processNumber );
        return this.favoriteProcess;
    }

    public removeFromFavoriteProcess ( processNumber: string ): FavoriteProcessData {
        this.favoriteProcess.favoriteProcess = this.favoriteProcess.favoriteProcess.filter( p => p !== processNumber );
        return this.favoriteProcess;
    }
}
