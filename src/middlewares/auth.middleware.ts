import express, { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../errors/unauthorized.error.js";
import { DecodedIdToken, getAuth } from "firebase-admin/auth";
import { ForbiddenError } from "../errors/forbidden.error.js";
import { UserService } from "../services/user.service.js";

export const auth = (app: express.Express) => {
  app.use(async (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'POST' && (req.url.startsWith("/auth/login") || req.url.startsWith("/auth/recovery"))) {
      return next();
    }
    
    const token = req.headers.authorization?.split("Bearer ")[1];

    if (!token) 
      return next(new UnauthorizedError());
        
    try {
      const decodedIdToken: DecodedIdToken = await getAuth().verifyIdToken(token, true);
      const user = await new UserService().getById(decodedIdToken.uid);

      if (!user)
        return next(new ForbiddenError());
      
      return next();  
    } catch (error) {
      next(new UnauthorizedError());
    }    
  });
};