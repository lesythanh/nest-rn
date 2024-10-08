const bcrypt = require('bcrypt');
const saltRounds = 10;

export const hashPasswordHelper = async (plainPasword: string) => {
    try {
        return await bcrypt.hash(plainPasword, saltRounds);
    } catch (error) {
        console.log(error);
    }
}

export const comparePasswordHelper = async (plainPasword: string, hashPassword: string) => {
    try {
        return await bcrypt.compare(plainPasword, hashPassword);
    } catch (error) {
        console.log(error);
    }
}