declare global {
  namespace Express {
    type User = User;

    interface Request {
      user?: User;
    }
  }
}
