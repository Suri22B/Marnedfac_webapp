import express, { Request, Response } from 'express';
const router = express.Router();

// Root route (renders index.ejs)
router.get('/', (req: Request, res: Response) => {
  res.render('index', {
    apiKey: process.env.API_KEY,
    serverUrl: process.env.SERVER_URL,
  });
});

router.get('/menus', (req: Request, res: Response) => {
  res.render('defac-menu-list', {
    apiKey: process.env.API_KEY,
    serverUrl: process.env.SERVER_URL,
  });
});

router.get('/events', (req: Request, res: Response) => {
  res.render('defac-event-mngmt', {
    apiKey: process.env.API_KEY,
    serverUrl: process.env.SERVER_URL,
  });
});

router.get('/defacs', (req: Request, res: Response) => {
  res.render('admin-defac', {
    apiKey: process.env.API_KEY,
    serverUrl: process.env.SERVER_URL,
  });
});

router.get('/posts', (req: Request, res: Response) => {
  res.render('admin-post', {
    apiKey: process.env.API_KEY,
    serverUrl: process.env.SERVER_URL,
  });
});

router.get('/units', (req: Request, res: Response) => {
  res.render('admin-unit', {
    apiKey: process.env.API_KEY,
    serverUrl: process.env.SERVER_URL,
  });
});

router.get('/orders', (req: Request, res: Response) => {
  res.render('defac-orders', {
    apiKey: process.env.API_KEY,
    serverUrl: process.env.SERVER_URL,
  });
});

router.get('/feedbacks', (req: Request, res: Response) => {
  res.render('feedback-admin', {
    apiKey: process.env.API_KEY,
    serverUrl: process.env.SERVER_URL,
  });
});

router.get('/home', (req: Request, res: Response) => {
  res.render('soldier', {
    apiKey: process.env.API_KEY,
    serverUrl: process.env.SERVER_URL,
  });
});

router.get('/soldier-feedback', (req: Request, res: Response) => {
  res.render('feedback', {
    apiKey: process.env.API_KEY,
    serverUrl: process.env.SERVER_URL,
  });
});

router.get('/soldier-menu-list', (req: Request, res: Response) => {
  res.render('menu', {
    apiKey: process.env.API_KEY,
    serverUrl: process.env.SERVER_URL,
  });
});

router.get('/soldier-events-list', (req: Request, res: Response) => {
  res.render('events', {
    apiKey: process.env.API_KEY,
    serverUrl: process.env.SERVER_URL,
  });
});

router.get('/soldier-event-detail', (req: Request, res: Response) => {
  res.render('events-detail', {
    apiKey: process.env.API_KEY,
    serverUrl: process.env.SERVER_URL,
  });
});

router.get('/soldier-order-list', (req: Request, res: Response) => {
  res.render('orders-list', {
    apiKey: process.env.API_KEY,
    serverUrl: process.env.SERVER_URL,
  });
});

router.get('/soldier-profile', (req: Request, res: Response) => {
  res.render('user-profile', {
    apiKey: process.env.API_KEY,
    serverUrl: process.env.SERVER_URL,
  });
});

router.get('/defac-profile', (req: Request, res: Response) => {
  res.render('defac-user', {
    apiKey: process.env.API_KEY,
    serverUrl: process.env.SERVER_URL,
  });
});

router.get('/defac-detail', (req: Request, res: Response) => {
  res.render('defac-detail', {
    apiKey: process.env.API_KEY,
    serverUrl: process.env.SERVER_URL,
  });
});

router.get('/defac-list', (req: Request, res: Response) => {
  res.render('defac', {
    apiKey: process.env.API_KEY,
    serverUrl: process.env.SERVER_URL,
  });
});

router.get('/reset-password', (req: Request, res: Response) => {
  res.render('reset-password', {
    apiKey: process.env.API_KEY,
    serverUrl: process.env.SERVER_URL,
  });
});

router.get('/cart', (req: Request, res: Response) => {
  res.render('my-cart', {
    apiKey: process.env.API_KEY,
    serverUrl: process.env.SERVER_URL,
  });
});

router.get('/banners', (req: Request, res: Response) => {
  res.render('admin-banner', {
    apiKey: process.env.API_KEY,
    serverUrl: process.env.SERVER_URL,
  });
});

router.get('/galleries', (req: Request, res: Response) => {
  res.render('admin-gallery', {
    apiKey: process.env.API_KEY,
    serverUrl: process.env.SERVER_URL,
  });
});

router.get('/food_types', (req: Request, res: Response) => {
  res.render('defac-timing', {
    apiKey: process.env.API_KEY,
    serverUrl: process.env.SERVER_URL,
  });
});

export default router;
