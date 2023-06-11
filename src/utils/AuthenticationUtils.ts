import { config } from "dotenv";
import axios from "axios";
import SessionUtils from "./SessionUtils";
import Logger from "../logging/Logger";

config();

async function ValidateNonce (token: string) {
    // regex to split username and nonce based on username@domain:nonce
    // example matthe815@localhost:89ashfadshiu9dqhdq
    const regex = /([a-zA-Z0-9]+@[a-zA-Z0-9]+):([a-zA-Z0-9]{0,})/;

    // split token into username and nonce from regex
    const [match, username, nonce] = token.match(regex) || [];
    const credentials = SplitIdentifier(username || "");

    const user = await CheckCredentials(credentials.username, credentials.domain, nonce);
    
    if (!user) {
        return null;
    }
    
    return SessionUtils.GetLocalUserOrMake(user);
}

export type Credentials = {
    username: string;
    domain: string;
}

function SplitIdentifier (credit: string): Credentials {
    const regex = /([a-zA-Z0-9]+)@([a-zA-Z0-9]+)/;
    const [match, username, domain] = credit.match(regex) || [];
    return { username: username || "", domain: domain || "" };
}

async function CheckCredentials (username: string, domain: string, token: string) {
    try {
        const { data: response } = await axios.post(`http://${domain}:1299/auth/validate`, { user: username, nonce: token });
        
        if (response.message === 'Nonce is invalid.') {
            return null;
        }
    
        Logger.info(JSON.stringify(response.data));
    
        return response.data.user;
    } catch (e: any) {
        Logger.error(`Error validating nonce: ${e.message}`);
        return null;
    }
}

async function VerifyCredentials (token: string): Promise<any> {
    // check if it's a token format or a usernam@domain format
    if (token.includes('@')) {
        return await ValidateNonce(token);
    } else {
        return await SessionUtils.GetUserBySession(token);
    }
}

export default {
    ValidateNonce,
    VerifyCredentials,
}
