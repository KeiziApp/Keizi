import { Client } from 'ts-postgres'
import Logger from '../logging/Logger'
import { config } from 'dotenv'

config();

export default class Database {
    private static instance: Database;
    private client: Client;

    static credentials = { 
        host: process.env.POSTGRES_HOST,
        port: Number(process.env.POSTGRES_PORT),
        database: process.env.POSTGRES_DB,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD
    }

    private constructor(client: Client) {
        Logger.info('Database instance created');
        this.client = client;
    }

    makeInstance(): void {
        this.client.connect();
    }

    static getInstance(): Database {
        if (!Database.instance) {
            console.log(this.credentials)
            Database.instance = new Database(new Client(this.credentials));
            Database.instance.makeInstance();
        }
        return Database.instance;
    }

    async migrate () {
        await this.client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                domain VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL,
                avatar VARCHAR(255) NOT NULL DEFAULT 'https://www.gravatar.com/a',
                email VARCHAR(255) NOT NULL,
                is_admin BOOLEAN NOT NULL DEFAULT FALSE,
                created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMP NOT NULL DEFAULT NOW()
            );
        `);

        await this.client.query(`
            CREATE TABLE IF NOT EXISTS communities (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                display_name VARCHAR(255) NOT NULL,
                domain VARCHAR(255) NOT NULL,
                description VARCHAR(255) NOT NULL,
                icon VARCHAR(255) NOT NULL DEFAULT 'https://www.gravatar.com/a',
                created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMP NOT NULL DEFAULT NOW()
            );
        `);

        await this.client.query(`
            CREATE TABLE IF NOT EXISTS posts (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                content VARCHAR(255) NOT NULL,
                community_id INTEGER NOT NULL,
                cross_post_domain VARCHAR(255),
                user_id INTEGER NOT NULL,
                created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
                FOREIGN KEY (community_id) REFERENCES communities(id),
                FOREIGN KEY (user_id) REFERENCES users(id)
            );
        `);

        await this.client.query(`
            CREATE TABLE IF NOT EXISTS comments (
                id SERIAL PRIMARY KEY,
                content VARCHAR(255) NOT NULL,
                post_id INTEGER NOT NULL,
                linked_comment_id INTEGER,
                user_id INTEGER NOT NULL,
                created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
                FOREIGN KEY (post_id) REFERENCES posts(id),
                FOREIGN KEY (user_id) REFERENCES users(id)
            );
        `);

        await this.client.query(`
            CREATE TABLE IF NOT EXISTS upvotes (
                id SERIAL PRIMARY KEY,
                post_id INTEGER NOT NULL,
                user_id INTEGER NOT NULL,
                created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
                FOREIGN KEY (post_id) REFERENCES posts(id),
                FOREIGN KEY (user_id) REFERENCES users(id)
            );
        `);

        await this.client.query(`
            CREATE TABLE IF NOT EXISTS sessions (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                token VARCHAR(255) NOT NULL,
                ip VARCHAR(255) NOT NULL,
                device VARCHAR(255) NOT NULL,
                created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
                FOREIGN KEY (user_id) REFERENCES users(id)
            );
        `)

        await this.client.query(`
            CREATE TABLE IF NOT EXISTS downvotes (
                id SERIAL PRIMARY KEY,
                post_id INTEGER NOT NULL,
                user_id INTEGER NOT NULL,
                created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
                FOREIGN KEY (post_id) REFERENCES posts(id),
                FOREIGN KEY (user_id) REFERENCES users(id)
            );
        `);

        process.exit(0);
    }

    async query(sql: string, params?: any[]) {
        Logger.debug(sql);
        const row = await this.client.query(sql, params);
        Logger.debug(JSON.stringify(row));
        return row;
    }
}