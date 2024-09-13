import express, { Request, Response, NextFunction } from 'express'

//import all routes
import authRoutes from './routers/auth.router'
import { register } from '../../controllers/auth.controller';

//create router
const router = express.Router();

router.use('/auth', authRoutes)

router.get('/', (req: Request, res: Response, next: NextFunction) =>{

     res.status(200).json({
         error: false,
         errors: [],
         data: { 
             name: 'URL Shortner API - V1 Default',
         },
         message: 'url-shortner api v1.0.0',
         status: 200
     })
 })

export default router;