import express from 'express';
import apikey from '../auth/apikey';
import permission from '../helpers/permission';
import { Permission } from '../database/model/ApiKey';
import signup from './access/signup';
import login from './access/login';
import logout from './access/logout';
import token from './access/token';
import credential from './access/credential';
import feedback from './feedback/feedback';
import defac from './defac/defac';
import menu from './menu/menu';
import monthlyMenu from './monthly-menu/index';
import event from './events/index';
import post from './post/index';
import unit from './unit/index';
import verifyEmail from './access/verify-email';
import forgotPassword from './access/forgot-password';
import order from './order/index';
import banner from './banner/index';
import gallery from './gallery/index';
import timing from './timing/index';

import profile from './profile';

const router = express.Router();

router.use('/verify-email', verifyEmail);
/*---------------------------------------------------------*/
router.use(apikey);
/*---------------------------------------------------------*/
/*---------------------------------------------------------*/
router.use(permission(Permission.GENERAL));
/*---------------------------------------------------------*/
router.use('/signup', signup);
router.use('/self-service', forgotPassword);
router.use('/login', login);
router.use('/logout', logout);
router.use('/token', token);
router.use('/credential', credential);
router.use('/profile', profile);
router.use('/feedback', feedback);
router.use('/defac', defac);
router.use('/menu', menu);
router.use('/monthly-menu', monthlyMenu);
router.use('/event', event);
router.use('/post', post);
router.use('/unit', unit);
router.use('/order', order);
router.use('/banner', banner);
router.use('/gallery', gallery);
router.use('/timing', timing);

// router.use('/events', defac);
// router.use('/menus', defac);

export default router;
