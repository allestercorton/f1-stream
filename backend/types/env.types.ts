export type Env = {
  server: {
    mode: string;
    port: number;
  };
  client: {
    url: string;
  };
  mongo: {
    uri: string;
  };
  token: {
    jwt_secret: string;
  };
  email: {
    service: string;
    from: string;
    username: string;
    password: string;
  };
};
