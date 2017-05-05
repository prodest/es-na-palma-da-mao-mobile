import { AuthenticationService } from '../../../security/security.module';
import { BusStop, FavoriteStops, FavoriteLocation } from './models/index';

/**
 * 
 * 
 * @export
 * @class CeturbStorage
 */
export class TranscolOnlineStorage {

    public static $inject: string[] = [ '$localStorage', 'authenticationService' ];
    private favoriteStopsKey: string = 'transcol-online-favorite-stops';

    
    /**
     * Creates an instance of TranscolOnlineStorage.
     * @param {*} $localStorage 
     * @param {AuthenticationService} authenticationService 
     * 
     * @memberof TranscolOnlineStorage
     */
    constructor( private $localStorage: any, private authenticationService: AuthenticationService ) {}

   
    /**
     * 
     * 
     * @readonly
     * @type {FavoriteStops}
     * @memberof TranscolOnlineStorage
     */
    public get favoriteStops(): FavoriteStops {
        this.$localStorage[ this.favoriteStopsKey ] = this.$localStorage[ this.favoriteStopsKey ] || { items: [] };
        return this.$localStorage[ this.favoriteStopsKey ] as FavoriteStops;
    }

    
    /**
     * 
     * 
     * 
     * @memberof TranscolOnlineStorage
     */
    public set favoriteStops( favoriteStops: FavoriteStops ) {
        this.$localStorage[ this.favoriteStopsKey ] = favoriteStops || { items: [] };
    }

    
    /**
     * 
     * 
     * @readonly
     * @type {boolean}
     * @memberof TranscolOnlineStorage
     */
    public get hasFavoriteStops(): boolean {
        let favoriteStops: FavoriteStops = this.$localStorage[ this.favoriteStopsKey ];
        if ( !!favoriteStops ) {
            return favoriteStops.id === this.authenticationService.user.sub;
        } else {
            return false;
        }
    }

   
    /**
     * 
     * 
     * @param {number} stopId 
     * @returns {boolean} 
     * 
     * @memberof TranscolOnlineStorage
     */
    public isFavoriteStop( stop: BusStop ): boolean {
        return this.favoriteStops.items.some( s => s.stop === stop.id );
    }

   
    /**
     * 
     * 
     * @param {number} stopId 
     * @returns {FavoriteStops} 
     * 
     * @memberof TranscolOnlineStorage
     */
    public addToFavoriteStops( stop: BusStop, type: FavoriteLocation ): FavoriteStops {
        if ( !this.isFavoriteStop( stop ) ) {
            this.favoriteStops.items.push( { stop: stop.id, type });
        }    
        return this.favoriteStops;
    }

  
    /**
     * 
     * 
     * @param {number} stopId 
     * @returns {FavoriteStops} 
     * 
     * @memberof TranscolOnlineStorage
     */
    public removeFromFavoriteStops( stop: BusStop ): FavoriteStops {
        this.favoriteStops.items = this.favoriteStops.items.filter( s => s.stop !== stop.id );
        return this.favoriteStops;
    }
}