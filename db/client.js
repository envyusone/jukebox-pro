import "dotenv/config";
import pg from "pg"; // Make sure "pg" is written here!

const db = new pg.Client(process.env.DATABASE_URL);

export default db;
