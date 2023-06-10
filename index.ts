import { config } from 'dotenv'
import logger from './src/logging/Logger'
import express from 'express'
import Routes from './src/routes/Routes';
import Database from './src/database/Database';
import { createInterface } from 'readline';
import PasswordUtils from './src/utils/PasswordUtils';

config();

const action = process.argv[2] || 'start';
const app = express();

const rl = createInterface({
    input: process.stdin,
    output: process.stdout
});

app.use(express.json());

switch (action) {
    case 'start':
        Routes.Setup(app)
        app.listen(process.env.API_PORT, () => logger.debug(`Server server on port ${process.env.API_PORT}`));
        break;
    case 'makeadmin':
        logger.debug('Making admin');

        // take input from console for credentials and make a user
        rl.question('Username: ', (username) => {
            rl.question('Password: ', (password) => {
                const passwordHash = PasswordUtils.makeHash(password);
                
                Database.getInstance().query('INSERT INTO users (username, domain, email, password, is_admin) VALUES ($1, $2, $3, $4, $5)', [username, process.env.SERVER_NAME, `${username}@${process.env.SERVER_NAME}`, passwordHash, true]);
                logger.debug('Admin created');
                rl.close();
                process.exit(0);
            });
        });
        break;
    case 'migrate':
        logger.debug('Migrating database');
        Database.getInstance().migrate();
        process.exit(0);
        break;
}