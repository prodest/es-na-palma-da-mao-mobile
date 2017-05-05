import { FavoriteLocation } from './index';


// ordena favoritos pelo tipo: casa => traballho => outros
export const sortByFavorite = ( a: { type: FavoriteLocation }, b: { type: FavoriteLocation }) => {
    if ( a.type === 'outros' ) {
        return 1;
    }
    if ( b.type === 'outros' ) {
        return -1;
    }
    return a.type.localeCompare( b.type );
};
