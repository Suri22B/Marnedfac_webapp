import express, { Request, Response, NextFunction } from 'express';
import Logger from './core/Logger';
import cors from 'cors';
import { corsUrl, environment } from './config';
import './database'; // initialize database
// import './cache'; // initialize cache
import {
  NotFoundError,
  ApiError,
  InternalError,
  ErrorType,
} from './core/ApiError';
import routes from './routes';
import viewRoutes from './routes/viewRoutes';
import path from 'path';

process.on('uncaughtException', (e) => {
  Logger.error(e);
});

const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, '../src/views'));
app.use(express.static('public'));
app.use(express.static('uploads'));

app.use(express.json({ limit: '10mb' })); 
app.use(
  express.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }),
);
app.use(cors({ origin: corsUrl, optionsSuccessStatus: 200 }));

// Routes
// Use the view routes for rendering EJS templates
app.use('/', viewRoutes);

app.use('/api', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => next(new NotFoundError()));

// Middleware Error Handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    ApiError.handle(err, res);
    if (err.type === ErrorType.INTERNAL)
      Logger.error(
        `500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`,
      );
  } else {
    Logger.error(
      `500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`,
    );
    Logger.error(err);
    if (environment === 'development') {
      return res.status(500).send(err);
    }
    ApiError.handle(new InternalError(), res);
  }
});

export default app;
