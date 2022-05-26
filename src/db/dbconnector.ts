import { Pool } from "pg";

const pool = new Pool ({
    max: 20,
    connectionString: 'postgres://postgres:qwe123@localhost:5432/comrades',
    idleTimeoutMillis: 30000,
});

export default pool;