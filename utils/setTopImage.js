const User = require('../models/Users');

const setTopImage = async ( res ) => {
    try{
        if(res){
            const { id } = res.locals.currentUser; //ログイン中のユーザーのID
            const loginUser = await User.findById(id); //ログイン中のユーザーの情報を全て取得
            topImg =  loginUser.image;
            return topImg;
        }
        return "";
    }catch(e){
        console.log(e);
        return "";
    }
};

module.exports = setTopImage;