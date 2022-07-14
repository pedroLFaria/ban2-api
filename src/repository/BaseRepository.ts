import pool from "../db/dbconnector";

export default class BaseRepository {
    
    public static async fetch<T>(sql: string) {
        const dbClient = await pool.connect();      
        const { rows } = await dbClient.query(sql);
        dbClient.release();
        const todos: T[] = rows;
        return todos;
    }

    public static async edit(sql: string) {
        const dbClient = await pool.connect();
        await dbClient.query(sql);
        dbClient.release();
    }
}