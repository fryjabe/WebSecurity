const jwt= require('jsonwebtoken');
    module.exports = (req, res, next) => {
        // verify the token
        try {
        const token= req.cookies.Cookie;
        console.log(token);
        const decoded=  jwt.verify(token, process.env.JWT_KEY); 
        req.userData= decoded;
        next();
    } catch (error){
        return res.status(401).json({
            message: 'Authorisation failed'
            });
        }
    };
        

``