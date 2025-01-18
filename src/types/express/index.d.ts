declare global {
  namespace Express {
    export interface Request {
      auth?: {
        userId: string;
      };
      userId?: string;
    }
  }
}

export {};
