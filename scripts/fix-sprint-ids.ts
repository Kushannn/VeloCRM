// scripts/fix-sprint-ids.ts
import { MongoClient, ObjectId } from "mongodb";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

async function main() {
  const client = new MongoClient(process.env.DATABASE_URL!);
  await client.connect();

  const db = client.db(); // your db name, or pass it explicitly
  const sprints = db.collection("Sprint");

  const all = await sprints.find({}).toArray();

  for (const sprint of all) {
    await sprints.updateOne(
      { _id: sprint._id },
      {
        $set: {
          projectId: new ObjectId(sprint.projectId),
          createdById: new ObjectId(sprint.createdById),
          organizationId: new ObjectId(sprint.organizationId),
        },
      },
    );
  }

  console.log(`Migrated ${all.length} sprints`);
  await client.close();
}

main();
