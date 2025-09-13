import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

let db: Db | null = null;

export async function getDb(): Promise<Db> {
  if (!db) {
    await client.connect();
    db = client.db(); 
    console.log("Connected to MongoDB (native driver)" );
  }
  return db;
}
