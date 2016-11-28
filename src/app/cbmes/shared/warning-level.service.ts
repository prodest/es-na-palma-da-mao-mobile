export class WarningLevelService {

    private levels = [
        { name: 'baixo', id: 0, description: 'Baixa' },
        { name: 'medio', id: 1, description: 'Média' },
        { name: 'alto', id: 2, description: 'Alta' }
    ];

    private types = [
        { name: 'circle', id: 0 },
        { name: 'polygon', id: 1 }
    ];

    public getLevelName( levelId: number ): string {
        let level = this.levels.filter(( item ) => levelId === item.id );
        if ( level.length === 1 ) {
            return level[ 0 ].name;
        }

        return '';
    }

    public getLevelDescription( levelId: number ): string {
        let level = this.levels.filter(( item ) => levelId === item.id );
        if ( level.length === 1 ) {
            return level[ 0 ].description;
        }

        return '';
    }

    public getTypeName( typeId: number ): string {
        let type = this.types.filter(( item ) => typeId === item.id );
        if ( type.length === 1 ) {
            return type[ 0 ].name;
        }

        return '';
    }
}
