import jwt from 'jsonwebtoken'



export const generateAccessTokenAdmin = function ({
    id
}:{
    id:string
}) {
    
    return jwt.sign({ id:id }, process.env.ACCESS_TOKEN_SECRET!, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    })

     

}

export const verifyAccessTokenAdmin = function (token: string): { id: string } | null {
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
        return decoded as { id: string };
    } catch (error) {
        return null;
    }
}