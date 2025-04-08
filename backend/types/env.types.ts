export type Env = {
  server: {
    mode: string;
    port: number;
    url: string;
  };
  client: {
    url: string;
  };
  mongo: {
    uri: string;
  };
  google: {
    clientID: string;
    clientSecret: string;
  };
  session: {
    secret: string;
    cookie: {
      maxAge: number;
    };
  };
};
