import { Response } from 'express'
import logger from '../logging/Logger'
import Get_User from './users/get_user'
import Login from './auth/login'
import Fetch_All from './communities/fetch_all'
import Register from './auth/register'

export function Setup (app: any) {
    logger.info('Setting up routes...')

    app.get('/', (req: Request, res: Response) => {
        res.json({ api: 'v1' })
    })

    app.get(Get_User.path, Get_User.handler);
    app.get(Login.path, Login.handler);
    app.post(Register.path, Register.handler);
    app.get(Fetch_All.path, Fetch_All.handler);
}

export default {
    Setup
}
