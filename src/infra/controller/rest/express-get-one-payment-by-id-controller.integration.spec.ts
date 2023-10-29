import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

describe('express-get-one-payment-by-id-controller', () => {
  let prismaClient: PrismaClient;

  beforeAll(async () => {
    prismaClient = new PrismaClient();
  });

  beforeEach(async () => {
    await prismaClient.$transaction([prismaClient.payment.deleteMany()]);
  });

  it('should succeed and return one payment ', async () => {
    await prismaClient.$transaction([
      prismaClient.payment.create({
        data: {
          id: 'd2727083-b0d1-4eaa-9741-e50da333efed',
          cardTokenId: 'bc211119-dea7-43bb-ae26-1c52aa1222ad',
          appointmentId: '0f81fba6-e8af-4369-9261-99216e6358fc',
        },
      }),
    ]);

    const sut = await request('http://localhost:3001').get('/payments/d2727083-b0d1-4eaa-9741-e50da333efed');

    expect(sut.status).toBe(200);
    expect(sut.body).toStrictEqual({
      id: 'd2727083-b0d1-4eaa-9741-e50da333efed',
      cardTokenId: 'bc211119-dea7-43bb-ae26-1c52aa1222ad',
      appointmentId: '0f81fba6-e8af-4369-9261-99216e6358fc',
    });
  });

  it('should fail and return an error', async () => {
    const sut = await request('http://localhost:3001').get('/payments/d2727083-b0d1-4eaa-9741-e50da333efed');

    expect(sut.status).toBe(404);
    expect(sut.body).toStrictEqual({
      error: 'Payment not found.',
    });
  });
});
