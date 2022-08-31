import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import express, { Request, Response } from "express";
import { faker } from "@faker-js/faker";

const app = express();
app.use(express.json());
const port = 3000;

const users = Array.from({ length: 10 }).map(() => {
  return { name: faker.internet.userName(), email: faker.internet.email() };
});

app.get("/", async (req: Request, res: Response) => {
  res.json({ message: "Congratulations, you're now connected to the api!" });
});

app.get("/seed", async (req: Request, res: Response) => {
  const createMany = await prisma.user.createMany({
    data: [...users],
    skipDuplicates: true,
  });
  res.json({ message: "Congratulations, you've seeded the db!" });
});

// get single user
app.get("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
  });
  res.json({ message: "success", data: user });
});

// get all users
app.get("/users", async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json({ message: "success", data: users });
});

// create a new user
app.post("/create-user", async (req: Request, res: Response) => {
  //get name and email from the request body
  const { name, email } = req.body;
  const user = await prisma.user.create({
    data: {
      name: String(name),
      email: String(email),
    },
  });
  res.json({ message: "success", data: user });
});

// update user with id
app.patch("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const user = await prisma.user.update({
    where: {
      id: Number(id),
    },
    data: {
      name: String(name),
      email: String(email),
    },
  });
  res.json({ message: "success", data: user });
});

// delete a user
app.delete("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await prisma.user.delete({
    where: {
      id: Number(id),
    },
  });
  res.json({ message: "success" });
});

app.listen(port, () => console.log(`Served on port ${port}`));
