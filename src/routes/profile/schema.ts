import Joi from 'joi';
import { JoiObjectId } from '../../helpers/validator';

export default {
  userId: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
  profile: Joi.object().keys({
    name: Joi.string().required().min(3),
    email: Joi.string().required().email(),
    contact: Joi.number().required(),
    unit: Joi.string().required(),
    rank: Joi.string().required(),
    post: Joi.string().required(),
    defaultDefac: Joi.string().required().id(),
  }),
};
