export interface ISettings {
    api: {
        invalidTokenHttpCode: number;
        news: string,
        calendars: string,
        sep: string,
        detran: string,
        dio: string,
        ceturb: string,
        cbmes: string,
        push: string,
        espm: string,
        acessocidadao: string,
        acessocidadaoApi: string,
        transparency: string
    };
    push: {
        senderId: string;
        forceShow: boolean,
        alert: string,
        badge: string,
        sound: string,
        gcmSandbox: string,
        secret: string,
        defaultIcon: string,
        defaultColor: string
    };
    pagination: {
        pageNumber: number,
        pageSize: number
    };
    locale: string;
    identityServer: {
        url: string,
        publicKey: string;
        scopes: string[];
        defaultScopes: string;
        clients: {
            espm: {
                id: string,
                secret: string
            };
            espmExternalLoginAndroid: {
                id: string,
                secret: string
            };
        }
    };
    googleWebClientId: string;
    mobile: {
        client_id: string,
        client_secret: string,
        grant_type: string,
        scope: string,
        digitosCodigoVerificacao: number
    };
}
