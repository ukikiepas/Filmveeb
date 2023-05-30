export const oktaConfig = {
    clientId: '0oa94k6ebtRRcMOZr5d7',
    issuer: 'https://dev-28348968.okta.com/oauth2/default',
    redirectUri: 'https://localhost:3000/login/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: true
}
