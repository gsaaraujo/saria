import amqplib from 'amqplib';
import express, { Router, Request, Response } from 'express';

import { PrismaClient } from '@prisma/client';

import { ProcessPaymentService } from '@application/services/process-payment-service';
import { GetOnePaymentByIdService } from '@application/services/get-one-payment-by-id-service';

import { AxiosHttpAdapter } from '@infra/adapters/http/axios-http-adapter';
import { RabbitMQqueueAdapter } from '@infra/adapters/queue/rabbitmq-queue-adapter';
import { PrismaPaymentGateway } from '@infra/gateways/payment/prisma-payment-gateway';
import { PrismaPaymentRepository } from '@infra/repositories/prisma-payment-repository';
import { HttpAppointmentGateway } from '@infra/gateways/appointment/http-appointment-gateway';
import { PrismaPaymentTokenGateway } from '@infra/gateways/payment-token/prisma-card-token-gateway';
import { RabbitMQprocessPaymentController } from '@infra/controller/queue/rabbitmq-process-payment-controller';
import { ExpressGetOnePaymentByIdController } from '@infra/controller/rest/express-get-one-payment-by-id-controller';

const start = async () => {
  const app = express();
  const router = Router();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const prismaClient = new PrismaClient();
  const connection = await amqplib.connect('amqp://localhost:5672');
  const channel = await connection.createChannel();

  const httpAdapter = new AxiosHttpAdapter();
  const rabbitMQqueueAdapter = new RabbitMQqueueAdapter(channel);

  const prismaPaymentRepository = new PrismaPaymentRepository(prismaClient);

  const prismaPaymentGateway = new PrismaPaymentGateway(prismaClient);
  const httpAppointmentGateway = new HttpAppointmentGateway(httpAdapter);
  const prismaPaymentTokenGateway = new PrismaPaymentTokenGateway(prismaClient);

  const getOnePaymentByIdService = new GetOnePaymentByIdService(prismaPaymentGateway);
  const processPaymentService = new ProcessPaymentService(
    httpAppointmentGateway,
    prismaPaymentRepository,
    rabbitMQqueueAdapter,
  );

  const expressGetOnePaymentByIdController = new ExpressGetOnePaymentByIdController(getOnePaymentByIdService);
  const rabbitMQpayAppointmentController = new RabbitMQprocessPaymentController(
    processPaymentService,
    httpAppointmentGateway,
    prismaPaymentTokenGateway,
    rabbitMQqueueAdapter,
  );

  await rabbitMQpayAppointmentController.handle();

  router.get('/payments/:id', (request: Request, response: Response) => {
    return expressGetOnePaymentByIdController.handle(request, response);
  });

  app.use(router);

  app.listen(3001, () => {
    console.log(`Listening on port ${3001}`);
  });
};

start();
