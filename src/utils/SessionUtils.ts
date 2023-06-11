import Database from "../database/Database";

type User = {
    id: string,
    username: string,
    domain: string,
    password: string,
    avatar: string,
    email: string,
}

async function GetUserBySession (token: string): Promise<any> {
    const { rows } = await Database.getInstance().query('SELECT * FROM sessions WHERE token = $1', [token]);

    if (rows.length === 0) {
        return null;
    }

    const { rows: users } = await Database.getInstance().query('SELECT * FROM users WHERE id = $1', [rows[0][1]]);

    return users[0];
}

async function GetLocalUserOrMake (user: any): Promise<any> {
    // get the local user if it exists, otherwise insert it
    const { rows } = await Database.getInstance().query('SELECT * FROM users WHERE username = $1 AND domain = $2', [user.username, user.domain]);

    if (rows.length === 0) {
        await Database.getInstance().query('INSERT INTO users (username, domain, email, avatar, password) VALUES ($1, $2, $3, $4)', [user.username, user.domain, `${user.username}@${user.domain}`, user.avatar, "nopassword"]);
        const { rows: users } = await Database.getInstance().query('SELECT * FROM users WHERE username = $1 AND domain = $2', [user.username, user.domain]);
        return users[0];
    }

    return rows[0];
}

export default {
    GetUserBySession,
    GetLocalUserOrMake,
}