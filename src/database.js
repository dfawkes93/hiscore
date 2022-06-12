import sqlite3 from 'sqlite3';
import { open } from 'sqlite'

const db = new sqlite3.Database()
const dbPromise = open({
    filename: 'data.db',
    driver: sqlite3.Database
})

export async function setupDB() {
    const db = await dbPromise
    await db.migrate()
}
