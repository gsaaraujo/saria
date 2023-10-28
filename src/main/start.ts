import amqplib from 'amqplib';
import express, { Router } from 'express';
import { PrismaClient } from '@prisma/client';

import { PayAppointmentService } from '@application/services/pay-appointment-service';

import { AxiosHttpAdapter } from '@infra/adapters/http/axios-http-adapter';
import { RabbitMQqueueAdapter } from '@infra/adapters/queue/rabbitmq-queue-adapter';
import { PrismaPaymentRepository } from '@infra/repositories/prisma-payment-repository';
import { HttpAppointmentGateway } from '@infra/gateways/appointment/http-appointment-gateway';
import { PrismaPaymentTokenGateway } from '@infra/gateways/payment-token/prisma-card-token-gateway';
import { RabbitMQpayAppointmentController } from '@infra/controller/queue/rabbitmq-pay-appointment-controller';

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

  const httpAppointmentGateway = new HttpAppointmentGateway(httpAdapter);
  const prismaPaymentTokenGateway = new PrismaPaymentTokenGateway(prismaClient);

  const payAppointmentService = new PayAppointmentService(
    httpAppointmentGateway,
    prismaPaymentRepository,
    rabbitMQqueueAdapter,
  );

  const rabbitMQpayAppointmentController = new RabbitMQpayAppointmentController(
    payAppointmentService,
    httpAppointmentGateway,
    prismaPaymentTokenGateway,
    rabbitMQqueueAdapter,
  );

  await rabbitMQpayAppointmentController.handle();

  app.use(router);

  app.listen(3001, () => {
    console.log(`Listening on port ${3001}`);
  });
};

start();
