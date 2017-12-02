interface AuthConfig {
  redirectUri: string;
  clientID: string;
  domain: string;
  callbackURL: string;
}

export const AUTH_CONFIG: AuthConfig = {



  // development:
   clientID: 'aIeu8NVeP6e0AQpSA7CjuI2yGOnxGwq5',
   redirectUri: 'http://localhost:4200/',
  // production:
  // clientID: 'jyWECyB1KnNg3zjOK5S4BKf3ysv6qhBK',


  domain: 'palm.auth0.com',
  callbackURL: 'http://localhost:4200/'
};
