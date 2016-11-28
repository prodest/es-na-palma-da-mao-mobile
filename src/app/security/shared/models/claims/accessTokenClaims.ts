
/**
 * Claims dos protocolos de autenticação subjacentes (JSON Web Token (JWT) + Open Id Connect )
 * 
 * Ref: https://self-issued.info/docs/draft-ietf-oauth-json-web-token.html#rfc.section.4.1
 * Ref: http://openid.net/specs/openid-connect-core-1_0.html
 * @export
 * @interface AccessTokenClaims
 */
export interface AccessTokenClaims {

    /**
     * Authentication method references Claims
     * 
     * OPTIONAL. Authentication Methods References. JSON array of strings that are identifiers for authentication methods used in the authentication.
     * For instance, values might indicate that both password and OTP authentication methods were used. The definition of particular values to be used 
     * in the amr Claim is beyond the scope of this specification. Parties using this claim will need to agree upon the meanings of the values used,
     *  which may be context-specific. The amr value is an array of case sensitive strings.
     * @type {string[]}
     */
    amr: string[];


    /**
     * Audience Claim
     * 
     * The aud (audience) claim identifies the recipients that the JWT is intended for. Each principal intended to process the JWT MUST 
     * identify itself with a value in the audience claim. If the principal processing the claim does not identify itself with a value in 
     * the aud claim when this claim is present, then the JWT MUST be rejected. In the general case, the aud value is an array of case-sensitive
     * strings, each containing a StringOrURI value. In the special case when the JWT has one audience, the aud value MAY be a single 
     * case-sensitive string containing a StringOrURI value. The interpretation of audience values is generally application specific. Use of this claim is OPTIONAL.
     * 
     * @type {string}
     */
    aud: string;

    /**
     * 
     * 
     * @type {number}
     */
    auth_time: number;

    /**
     * Id of the client we want to use when hitting the authorization endpoint
     * 
     * @type {string}
     */
    client_id: string;


    /**
     * Expiration Time Claim
     * 
     * The exp (expiration time) claim identifies the expiration time on or after which the JWT MUST NOT be accepted for processing. 
     * The processing of the exp claim requires that the current date/time MUST be before the expiration date/time listed in the exp 
     * claim. Implementers MAY provide for some small leeway, usually no more than a few minutes, to account for clock skew. Its
     * value MUST be a number containing a NumericDate value. Use of this claim is OPTIONAL.
     * 
     * @type {number}
     */
    exp: number;


    /**
     * 
     * 
     * @type {string}
     */
    idp: string;


    /**
     * Issuer Claims
     * The iss (issuer) claim identifies the principal that issued the JWT. The processing of this claim is generally application specific.
     * The iss value is a case-sensitive string containing a StringOrURI value. Use of this claim is OPTIONAL.
     * 
     * @type {string}
     */
    iss: string;


    /**
     * Not Before Claim
     * The nbf (not before) claim identifies the time before which the JWT MUST NOT be accepted for processing. The processing of the nbf claim 
     * requires that the current date/time MUST be after or equal to the not-before date/time listed in the nbf claim. Implementers MAY provide 
     * for some small leeway, usually no more than a few minutes, to account for clock skew. Its value MUST be a number containing a NumericDate 
     * value. Use of this claim is OPTIONAL.
     * 
     * @type {number}
     */
    nbf: number;


    /**
     * Scoped Permissions
     * 
     * @type {string}
     */
    scope: string;


    /**
     * Subject Claims
     * 
     * The sub (subject) claim identifies the principal that is the subject of the JWT. The claims in a JWT are normally statements about the subject. 
     * The subject value MUST either be scoped to be locally unique in the context of the issuer or be globally unique. The processing of this claim is
     * generally application specific. The sub value is a case-sensitive string containing a StringOrURI value. Use of this claim is OPTIONAL.
     * 
     * @type {string}
     */
    sub: string;
}