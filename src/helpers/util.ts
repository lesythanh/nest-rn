const bcrypt = require('bcrypt');
const saltRounds = 10;

export const hashPasswordHelper = async (plainPasword: string) => {
    try {
        return await bcrypt.hash(plainPasword, saltRounds);
    } catch (error) {
        console.log(error);
    }
}