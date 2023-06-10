import bcrypt from 'bcrypt'

function makeHash (password: string) {
    return bcrypt.hashSync(password, 10);
}

function compareHash (password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
}

export default {
    makeHash,
    compareHash
}