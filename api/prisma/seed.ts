import { PrismaClient, Prisma } from "@prisma/client";
import { faker } from "@faker-js/faker";

const users = Array.from({ length: 10 }).map(() => {
  return { name: faker.internet.userName(), email: faker.internet.email() };
});

const prisma = new PrismaClient();

const userData: Prisma.userCreateInput[] = [...users];

async function main() {
  console.log(`Start seeding ...`);
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });
    console.log(`Created user with id: ${user.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
