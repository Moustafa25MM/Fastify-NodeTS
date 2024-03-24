import { PrismaClient } from '@prisma/client';

interface CustomNodeJsGlobal extends Global {
  prisma: PrismaClient;
}

const prisma = new PrismaClient();
export default prisma;
