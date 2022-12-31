const jwt=require('jsonwebtoken')

const SECRET_KEY="mynameishanzlabinzahidfromlahorepakistan"

const genRefreshToken=(id)=>{
    return jwt.sign({id},SECRET_KEY,{expiresIn:'3d'})
}

module.exports={genRefreshToken}