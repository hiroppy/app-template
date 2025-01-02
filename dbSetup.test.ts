import { exec } from "node:child_process";
import { promisify } from "node:util";
import { Prisma, PrismaClient } from "@prisma/client";
import { DockerComposeEnvironment, Wait } from "testcontainers";
import { createDBUrl } from "./src/app/_utils/db";

const execAsync = promisify(exec);

export async function setupDB({ port }: { port: "random" | number }) {
  const container = await new DockerComposeEnvironment(".", "compose.yml")
    .withEnvironmentFile(".env.test")
    // overwrite config
    .withEnvironment({
      POSTGRES_PORT: port === "random" ? "0" : `${port}`,
    })
    .withWaitStrategy("db", Wait.forListeningPorts())
    .up(["db"]);
  const dbContainer = container.getContainer("db-1");
  const mappedPort = dbContainer.getMappedPort(5432);
  const url = createDBUrl({
    host: dbContainer.getHost(),
    port: mappedPort,
  });

  await execAsync(`POSTGRES_URL=${url} npx prisma migrate dev`);

  const prisma = new PrismaClient({
    datasources: {
      db: {
        url,
      },
    },
  });

  async function down() {
    await prisma.$disconnect();
    await container.down();
  }

  return <const>{
    container,
    port,
    prisma,
    truncate: () => truncate(prisma),
    down,
    async [Symbol.asyncDispose]() {
      await down();
    },
  };
}

export async function truncate(prisma: PrismaClient) {
  const tableNames = Prisma.dmmf.datamodel.models.map((model) => {
    return model.dbName || model.name.toLowerCase();
  });
  const truncateQuery = `TRUNCATE TABLE ${tableNames.map((name) => `"${name}"`).join(", ")} CASCADE`;

  await prisma.$executeRawUnsafe(truncateQuery);
}
