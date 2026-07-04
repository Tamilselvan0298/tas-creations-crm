import { Request, Response, NextFunction } from 'express';
import { admin, isFirebaseAdminInitialized } from '../config/firebaseAdmin';

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    role?: string;
  };
}

export const authenticateJWT = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    // Check for mock token fallback (e.g. Bearer mock-admin or Bearer mock-sales)
    if (token.startsWith('mock-')) {
      const mockRole = token.split('-')[1] || 'sales';
      req.user = {
        uid: token,
        email: `${mockRole}@tas.com`,
        role: mockRole,
      };
      return next();
    }

    if (!isFirebaseAdminInitialized) {
      return res.status(503).json({ 
        error: 'Firebase Admin SDK not initialized. Set up your environment variables.' 
      });
    }

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        role: (decodedToken.role as string) || 'viewer', // Read custom claims role
      };
      return next();
    } catch (error) {
      console.error('Error verifying Firebase ID token:', error);
      return res.status(403).json({ error: 'Unauthorized: Invalid token' });
    }
  } else {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }
};

// Role authorization guard middleware generator
export const authorizeRoles = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
    }

    const { role } = req.user;
    if (role && allowedRoles.includes(role)) {
      return next();
    }

    return res.status(403).json({ 
      error: `Forbidden: Access restricted. Requires roles: [${allowedRoles.join(', ')}]` 
    });
  };
};
