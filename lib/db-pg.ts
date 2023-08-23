import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

declare global {
    var conn : Pool | undefined;
}

const conn = global.conn || new Pool({
    connectionString
});

if (process.env.NODE_ENV === "development") global.conn = conn;

export default conn;

