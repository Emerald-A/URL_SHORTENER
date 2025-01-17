import express, { Request, Response, NextFunction } from 'express'
import { config } from 'dotenv'
import ENV from '../utils/env.utils';
import { ENVType } from '../utils/enums.utils';
import ErrorResponse from '../utils/error.utils';
import errorHandler from '../middleware/error.mw'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import morgan from 'morgan';
import fileUpload from 'express-fileupload'
import path from 'path'
import expressSanitize from 'express-mongo-sanitize'
import helmet from 'helmet';
import hpp from 'hpp'
import cors from 'cors'
import userAgent from 'express-useragent'
import v1Routes from '../routes/v1/routes.router'
import { limitRequests } from '../middleware/ratelimit.mw'
//load my env vars
config();

const app = express(); 


//body parser
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: false }))
//or 
app.use(bodyParser.json({ limit: '50mb', inflate: true }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }))

//set the view engine
app.set('view engine', 'ejs')

//cookie Parser
app.use(cookieParser())

 
//http logging middleware
if (ENV.isStaging() || ENV.isDev()) {
    app.use(morgan('dev'))
}

// temporary files directory
app.use(fileUpload({ useTempFiles: true, tempFileDir: path.join(__dirname, 'tmp') }))

/**
 * sanitize data
 * secure db against sql injections
 */
app.use(expressSanitize())

//secure response headers
app.use(helmet());

//rate limiting
app.use(limitRequests)

//prevemt http parameter pollution attacks
app.use(hpp());

//enable CORS
//communicate with multiple domains

app.use(cors({ origin: true, credentials: true }))

app.use((req:Request, res: Response, next: NextFunction) => {

    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, X-Requested-With, Content-Type, Accept");
    next();
})


//set static folder
app.use(express.static(path.join(__dirname, 'public')))

//set user agents
app.use(userAgent.express())

//mount application routers (or routes)


app.get('/', (req: Request, res: Response, next: NextFunction) =>{

   let environment = ENVType.DEVELOPMENT;

   if (ENV.isProduction()) {
    environment = ENVType.PRODUCTION;
   } else if (ENV.isStaging()) {
    environment = ENVType.STAGING;
   } else if (ENV.isDev()) {
    environment = ENVType.DEVELOPMENT;
   }

//    return next(new ErrorResponse('Error',400, ['cannot get API health'], {name: 'URL Shortner'}))
    
    res.status(200).json({
        error: false,
        errors: [],
        data: { 
            name: 'URL Shortner API - DEFAULT',
            env: environment
        },
        message: 'url-shortner api v1.0.0',
        status: 200
    })
})

//application version-one routes
app.use('/v1', v1Routes)

app.use(errorHandler)

export default app; 