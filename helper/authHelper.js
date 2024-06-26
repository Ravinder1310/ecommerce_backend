import bcrypt from "bcryptjs";

export const HashPassword = async(password) => {
    try {
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password,saltRounds);
        return hashedPassword;
    } catch (error) {
        console.log(error);
    }
}


export const ComparePassword = async(password,hashedPassword) => {
     return bcrypt.compare(password,hashedPassword);
}