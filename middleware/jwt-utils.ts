import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PUBLIC_KEY_KEYCLAK } from '../Constantes/ConstantKeys';

interface DecodedToken {
  realm_access: {
    roles: string[]
  };
  role: string;
}

interface RequestWithToken extends Request {
  decodedToken?: DecodedToken;
}

export function verifyJwt(role: string) {
  return function(req: RequestWithToken, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(' ')[1];
      const publicKey = '-----BEGIN PUBLIC KEY-----\n' + PUBLIC_KEY_KEYCLAK + '-----END PUBLIC KEY-----';
      try {
        const decodedToken = jwt.verify(token, publicKey) as DecodedToken;
        if (!decodedToken.realm_access.roles.includes(role)) {
          return res.status(401).json({ error: 'Invalid role' });
        }
        req.decodedToken = decodedToken;
        next();
      } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
      }
    } else {
      res.status(401).json({ message: 'Authorization header is missing' });
    }
  }
}
