import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';
import OrderRepo from '../../database/repository/OrderRepo';
import Order from '../../database/model/Order';

import authentication from '../../auth/authentication';
import { UserRequest } from '../../types/app-request';
import UserRepo from '../../database/repository/UserRepo';
import { transporter } from '../../helpers/mail-service';
import {
  generateDefacEmailTemplate,
  generateUserEmailTemplate,
  generateUserOrderEmailTemplate,
} from './email-templates';

const router = express.Router();

router.post(
  '/',
  authentication,
  // validator(schema.post),
  asyncHandler(async (req: UserRequest, res) => {
    const ordersData = req.body.orders;
    const userId = req.user?._id;

    const newOrderId = '#' + Math.floor(100000 + Math.random() * 900000);
    const processedOrders = await Promise.all(
      ordersData?.map(async (order: any) => {
        // const existingOrder = await OrderRepo.findByMenu(
        //   order.orderedMenu,
        //   userId,
        // );

        // if (existingOrder) {
        //   // If the order already exists, update the quantity
        //   const updatedQuantity =
        //     Number(existingOrder.quantity.valueOf()) +
        //     Number(order.quantity.valueOf());
        //   existingOrder.quantity = updatedQuantity;
        //   return await OrderRepo.updateById(existingOrder._id, updatedQuantity);
        // } else {
        // If the order doesn't exist, create a new order
        const newOrderId = '#' + Math.random().toString(36).substr(2, 9);
        return await OrderRepo.create({
          ...order,
          orderedBy: userId,
          orderId: newOrderId,
        } as Order);
        // }
      }),
    );

    // Sending emails
    const userEmail = req.user?.email;
    const defacId = ordersData[0]?.defac;
    const defac = await UserRepo.findById(defacId);
    const defacEmail = defac?.email;
    // User email
    const userMailOptions = {
      to: userEmail,
      from: process.env.EMAIL_USER,
      subject: 'Order Confirmation',
      html: generateUserEmailTemplate(processedOrders),
    };

    // DEFAC email
    const defacMailOptions = {
      to: defacEmail,
      from: process.env.EMAIL_USER,
      subject: 'New Order Received',
      html: generateDefacEmailTemplate(processedOrders),
    };

    await transporter.sendMail(userMailOptions);
    await transporter.sendMail(defacMailOptions);

    new SuccessResponse('Order created successfully!', processedOrders).send(
      res,
    );
  }),
);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const orderList = await OrderRepo.getAll();
    new SuccessResponse('Fetched all order', orderList).send(res);
  }),
);

router.get(
  '/defac/:defacId',
  asyncHandler(async (req, res) => {
    const orderList = await OrderRepo.getByDefac(req.params.defacId);
    new SuccessResponse('Fetched order by id', orderList).send(res);
  }),
);

router.get(
  '/defacs',
  authentication,
  asyncHandler(async (req: any, res) => {
    const orders: any = await OrderRepo.getByDefac(req.user?._id);
    console.log(orders);
    // Group orders by user
    const groupedOrders = orders.reduce((acc: any, order: any) => {
      const { orderedBy, ...rest } = order;
      if (!acc[orderedBy._id]) {
        acc[orderedBy._id] = {
          userId: orderedBy._id,
          userName: orderedBy.name,
          unit: orderedBy.unit,
          orders: [],
        };
      }
      acc[orderedBy._id].orders.push(rest);
      return acc;
    }, {});

    const groupedOrderList = Object.values(groupedOrders);

    new SuccessResponse('Fetched orders by soldier', groupedOrderList).send(
      res,
    );
  }),
);

router.get(
  '/soldier',
  authentication,
  asyncHandler(async (req: any, res) => {
    const orders: any = await OrderRepo.getBySoldier(req.user?._id);

    new SuccessResponse('Fetched orders by soldier', orders).send(res);
  }),
);

router.get(
  '/:orderId',
  asyncHandler(async (req, res) => {
    const order = await OrderRepo.getById(req.params.orderId);
    new SuccessResponse('Fetched order by id', order).send(res);
  }),
);

router.delete(
  '/:orderId',
  asyncHandler(async (req, res) => {
    const response = await OrderRepo.deleteById(req.params.orderId);
    new SuccessResponse('Order deleted', response).send(res);
  }),
);

router.patch(
  '/',
  asyncHandler(async (req, res) => {
    const { orderId, status: orderStatus } = req.body;

    if (!orderId || !orderStatus) {
      return res
        .status(400)
        .json({ message: 'orderId and orderStatus are required' });
    }

    const updatedOrders = await OrderRepo.updateOrdersStatus(
      orderId,
      orderStatus,
    );

    if (orderStatus === 'COMPLETE') {
      const userMailOptions = {
        to: updatedOrders[0]?.orderedBy.email,
        from: process.env.EMAIL_USER,
        subject: 'Order Completion',
        html: generateUserOrderEmailTemplate(updatedOrders),
      };

      // DEFAC email

      await transporter.sendMail(userMailOptions);
    }

    if (updatedOrders) {
      new SuccessResponse('Order status updated', updatedOrders).send(res);
    } else {
      res.status(404).json({ message: 'Orders not found' });
    }
  }),
);
export default router;
