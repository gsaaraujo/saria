import { PrismaClient } from '@prisma/client';

const prismaClient = new PrismaClient();

async function main() {
  await prismaClient.$transaction([prismaClient.payment.deleteMany(), prismaClient.cardToken.deleteMany()]);
  await prismaClient.$transaction([
    prismaClient.payment.create({
      data: {
        id: 'd2727083-b0d1-4eaa-9741-e50da333efed',
        appointmentId: '0f81fba6-e8af-4369-9261-99216e6358fc',
        cardTokenId: 'bc211119-dea7-43bb-ae26-1c52aa1222ad',
      },
    }),
    prismaClient.cardToken.create({
      data: {
        id: 'bc211119-dea7-43bb-ae26-1c52aa1222ad',
        token: '3a64f8ee945e6838e505',
        patientId: 'b957aa4b-654e-47b0-a935-0923877d57a7',
      },
    }),
  ]);
}

main()
  .then(async () => {
    await prismaClient.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prismaClient.$disconnect();
    process.exit(1);
  });
