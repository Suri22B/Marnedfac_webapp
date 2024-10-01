import Joi from 'joi';
import { JoiAuthBearer } from '../../helpers/validator';

export default {
  credential: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
  refreshToken: Joi.object().keys({
    refreshToken: Joi.string().required().min(1),
  }),
  auth: Joi.object()
    .keys({
      authorization: JoiAuthBearer().required(),
    })
    .unknown(true),
  signup: Joi.object().keys({
    name: Joi.string().required().min(3),
    email: Joi.string().required().email(),
    contact: Joi.number().required(),
    unit: Joi.string().required(),
    rank: Joi.string().required(),
    post: Joi.string().required(),
    password: Joi.string().required().min(6),
    profilePicUrl: Joi.string().optional().uri(),
    defaultDefac: Joi.string().required().id(),
  }),
  feedback: Joi.object().keys({
    postedBy: Joi.string().required().id(),
    defac: Joi.string().required().id(),
    feedback: Joi.string().required().min(6),
    rating: Joi.number().required(),
  }),
  defac: Joi.object().keys({
    name: Joi.string().required().min(3),
    email: Joi.string().required().email(),
    contact: Joi.number().required(),
    address: Joi.string().optional(),
    profilePicUrl: Joi.string().optional().uri(),
    coverPicUrl: Joi.string().optional().uri(),
    password: Joi.string().required().min(6),
    post: Joi.string().required(),
    openingHour: Joi.string().required(),
    closingHour: Joi.string().required(),
    status: Joi.string().required(),
  }),
  events: Joi.object().keys({
    name: Joi.string().required().min(3),
    description: Joi.string().required(),
    category: Joi.string().required(),
    eventUrl: Joi.string().optional().uri(),
    defac: Joi.string().required().id(),
  }),
  menu: Joi.object().keys({
    name: Joi.string().required().min(3),
    description: Joi.string().required(),
    category: Joi.string().required(),
    colorCode: Joi.string().optional(),
    menuUrl: Joi.string().optional().uri(),
    defac: Joi.string().required().id(),
    isActiveToday: Joi.string().optional(),
  }),
  monthlyMenu: Joi.object().keys({
    menuUrl: Joi.string().optional().uri(),
    defac: Joi.string().required().id(),
  }),
  event: Joi.object().keys({
    name: Joi.string().required().min(3),
    description: Joi.string().required(),
    eventUrl: Joi.string().optional().uri(),
    defac: Joi.string().required().id(),
    startDate: Joi.string().required(),
    endDate: Joi.string().required(),
  }),
  post: Joi.object().keys({
    name: Joi.string().required().min(3),
  }),
  unit: Joi.object().keys({
    name: Joi.string().required().min(3),
  }),
  banner: Joi.object().keys({
    title: Joi.string().required().min(3),
    bannerUrl: Joi.string().optional().uri(),
    folderName: Joi.string().optional(),
  }),
  gallery: Joi.object().keys({
    galleryUrl: Joi.string().optional().uri(),
    folderName: Joi.string().optional(),
  }),
  timing: Joi.object().keys({
    foodType: Joi.string().required().min(3),
    openingHour: Joi.string().required(),
    closingHour: Joi.string().required(),
  }),
};
