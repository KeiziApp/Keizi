import { Response } from 'express'
import logger from '../logging/Logger'
import Get_User from './users/get_user'
import Login from './auth/login'
import Fetch_All_Communities from './communities/fetch_all'
import Register from './auth/register'
import Make_Community from './communities/make'
import Fetch_Community from './communities/fetch'
import Fetch_All_Posts from './communities/posts/fetch_all'
import Fetch_Post from './communities/posts/fetch'
import Make_Post from './communities/posts/make'
import upvote from './communities/posts/upvote'
import downvote from './communities/posts/downvote'

export function Setup (app: any) {
    logger.info('Setting up routes...')

    app.get('/', (req: Request, res: Response) => {
        res.json({ api: 'v1' })
    })

    app.get(Get_User.path, Get_User.handler);
    app.get(Fetch_All_Communities.path, Fetch_All_Communities.handler);
    app.get(Fetch_Community.path, Fetch_Community.handler);
    app.get(Fetch_All_Posts.path, Fetch_All_Posts.handler)
    app.get(Fetch_Post.path, Fetch_Post.handler)
    
    app.post(Make_Post.path, Make_Post.handler)
    app.post(upvote.path, upvote.handler)
    app.post(downvote.path, downvote.handler)
    app.post(Login.path, Login.handler);
    app.post(Register.path, Register.handler);
    app.post(Make_Community.path, Make_Community.handler);
}

export default {
    Setup
}
