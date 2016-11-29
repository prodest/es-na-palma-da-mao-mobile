/* eslint-disable */
const shared = {
  api: {
    invalidTokenHttpCode: 498,
    news: 'https://api.es.gov.br/news',
    calendars: 'https://api.es.gov.br/calendars',
    sep: 'https://api.es.gov.br/sep',
    detran: 'https://api.es.gov.br/detran',
    dio: 'https://api.es.gov.br/dio',
    ceturb: 'https://api.es.gov.br/ceturb',
    cbmes: 'https://api.es.gov.br/cbmes',
    push: 'https://api.es.gov.br/push',
    espm: 'https://api.es.gov.br/espm',
    transparency: 'https://api.es.gov.br/transparency',
    acessocidadao: process.env.API_ACESSO_CIDADAO_URL || 'https://sistemas.es.gov.br/prodest/acessocidadao.developer.webapi/api'
  },
  push: {
    senderId: process.env.PUSH_SENDER_ID,
    forceShow: true,
    alert: 'true',
    badge: 'true',
    sound: 'true',
    gcmSandbox: 'true'
  },
  pagination: {
    pageNumber: 0,
    pageSize: 10
  },
  locale: 'pt-br',
  identityServer: {
    url: process.env.IDENTITY_SERVER_URL || 'https://sistemas.es.gov.br/prodest/acessocidadao.developer/is',
    scopes: [ 'cpf', 'nome', 'email', 'dataNascimento', 'filiacao', 'celular', 'telefone', 'documentos', 'ApiAcessoCidadao', 'openid', 'offline_access' ],
    defaultScopes: 'openid offline_access ApiAcessoCidadao cpf nome email documentos',
    publicKey: '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArYaYlPnnrxBVwC4o0ykG\nVg8gjH/TerrrXS3GmsZeON6SCNuOBzUj+7RiEF64lE//gLY01nTJZtnUIPvmKJW/\n1+eWxGNW1Mh1JpT/f3A6Q5rp2WNKSBwvEFPE58lkD63Tewsn3+0dw+aFKaSW+l3A\nZ7WS4AxXxBLIRr2zpTL3DOCbeT/m2yEQ8Do662/d+ty7F08FJVaaz2PxmnLEeSQX\n6RTRPeFRPlGVj91H4h85Ln+0Oc0U/oiqa+AKwobWXLOqDKhn8HYZuoya368TqZ9X\n26QEp1g7psaT8kiNRFAt0Yb4WbgFSWf2r92HDS8dj25TNTeeLkvZ48KylTKU23DT\nqQIDAQAB\n-----END PUBLIC KEY-----',
    clients: {
      espm: {
        id: process.env.IDENTITY_SERVER_ESPM_ID || '0f06212c-aac4-482e-9489-c50789ceaa5c',
        secret: process.env.IDENTITY_SERVER_ESPM_SECRET || '39acabf2-2561-4e69-b9cf-89d77fd9f111'
      },

      espmExternalLoginAndroid: {
        id: process.env.IDENTITY_SERVER_EXTERNAL_LOGIN_ID || '0184531e-ca21-463b-ba67-2642997af511',
        secret: process.env.IDENTITY_SERVER_EXTERNAL_LOGIN_SECRET || '5e801b38-8ba2-4461-8faf-dd19b49e8f73'
      }
    }
  },
  googleWebClientId: process.env.GOOGLE_WEB_CLIENT_ID || '716051840979-c01amcdemhvn5hrfo1s37pteumkr6ial.apps.googleusercontent.com',
  mobile: {
    client_id: 'espm',
    client_secret: 'secret',
    grant_type: 'password',
    scope: 'openid',
    digitosCodigoVerificacao: 6
  }
};

const environments = {
  development: shared,
  production: shared,
  test: shared
};

module.exports = environments;

