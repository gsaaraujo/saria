import amqplib from 'amqplib';
import express, { Router } from 'express';
import { PrismaClient } from '@prisma/client';

import { PayAppointmentService } from '@application/services/pay-appointment-service';

import { RabbitMQqueueAdapter } from '@infra/adapters/queue/rabbitmq-queue-adapter';
import { PrismaPaymentRepository } from '@infra/repositories/prisma-payment-repository';
import { AxiosAppointmentGateway } from '@infra/gateways/appointment/axios-appointment-gateway';
import { AxiosPaymentTokenGateway } from '@infra/gateways/payment-token/axios-payment-token-gateway';
import { RabbitMQpayAppointmentController } from '@infra/controller/queue/rabbitmq-pay-appointment-controller';

const start = async () => {
  const app = express();
  const router = Router();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const prismaClient = new PrismaClient();
  const connection = await amqplib.connect('amqp://localhost:5672');
  const channel = await connection.createChannel();

  const rabbitMQqueueAdapter = new RabbitMQqueueAdapter(channel);

  const prismaPaymentRepository = new PrismaPaymentRepository(prismaClient);

  const axiosAppointmentGateway = new AxiosAppointmentGateway();
  const axiosPaymentTokenGateway = new AxiosPaymentTokenGateway();

  const payAppointmentService = new PayAppointmentService(
    axiosAppointmentGateway,
    prismaPaymentRepository,
    rabbitMQqueueAdapter,
  );

  const rabbitMQpayAppointmentController = new RabbitMQpayAppointmentController(
    payAppointmentService,
    axiosAppointmentGateway,
    axiosPaymentTokenGateway,
    rabbitMQqueueAdapter,
  );

  await rabbitMQpayAppointmentController.handle();

  app.use(router);

  app.listen(3001, () => {
    console.log(`Listening on port ${3001}`);
  });
};

start();
