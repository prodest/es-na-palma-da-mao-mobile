import { AuthenticationService } from '../../security/security.module';
import { FavoriteLinesData } from './models/index';

/**
 * 
 * 
 * @export
 * @class CeturbStorage
 */
export class CeturbStorage {

    public static $inject: string[] = [ '$localStorage', 'authenticationService' ];

    private favoriteLinesKey: string = 'Favoritelines';

    /**
     * Creates an instance of CeturbStorage.
     * 
     * @param {*} $localStorage
     * @param {AuthenticationService} authenticationService
     */
    constructor( private $localStorage: any, private authenticationService: AuthenticationService ) {
    }

    /**
     * 
     * 
     * @type {FavoriteLinesData}
     * @memberOf CeturbStorage
     */
    public get favoriteLines(): FavoriteLinesData {
        this.$localStorage[ this.favoriteLinesKey ] = this.$localStorage[ this.favoriteLinesKey ] || { favoriteLines: [] };
        return this.$localStorage[ this.favoriteLinesKey ] as FavoriteLinesData;
    }

    /**
     * 
     * 
     * 
     * @memberOf CeturbStorage
     */
    public set favoriteLines( lines: FavoriteLinesData ) {
        this.$localStorage[ this.favoriteLinesKey ] = lines;
    }

    /**
     * 
     * 
     * @readonly
     * @type {boolean}
     * @memberOf CeturbStorage
     */
    public get hasFavoriteLines(): boolean {
        let favoriteLines: FavoriteLinesData = this.$localStorage[ this.favoriteLinesKey ];
        if ( !!favoriteLines ) {
            return favoriteLines.id === this.authenticationService.user.sub;
        } else {
            return false;
        }
    }

    /**
     * 
     * 
     * @param {string} lineNumber
     * @returns {boolean}
     * 
     * @memberOf CeturbStorage
     */
    public isFavoriteLine( lineNumber: string ): boolean {
        return this.favoriteLines.favoriteLines.indexOf( lineNumber ) !== -1;
    }

    /**
     * 
     * 
     * @param {string} lineNumber
     * @returns {FavoriteLinesData}
     * 
     * @memberOf CeturbStorage
     */
    public addToFavoriteLines( lineNumber: string ): FavoriteLinesData {
        this.favoriteLines.favoriteLines.push( lineNumber );
        return this.favoriteLines;
    }

    /**
     * 
     * 
     * @param {string} lineNumber
     * @returns {FavoriteLinesData}
     * 
     * @memberOf CeturbStorage
     */
    public removeFromFavoriteLines( lineNumber: string ): FavoriteLinesData {
        this.favoriteLines.favoriteLines = this.favoriteLines.favoriteLines.filter( l => l !== lineNumber );
        return this.favoriteLines;
    }
}
