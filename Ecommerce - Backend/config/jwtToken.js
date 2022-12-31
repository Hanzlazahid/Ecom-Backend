const jwt=require('jsonwebtoken')

const SECRET_KEY="mynameishanzlabinzahidfromlahorepakistan"

const genToken=(id)=>{
    return jwt.sign({id},SECRET_KEY,{expiresIn:'1d'})
}

module.exports={genToken}