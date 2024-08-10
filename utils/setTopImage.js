
// 未ログイン時のリダイレクト処理
module.exports.setTopImage = async (req, res ) => {
    try{
        if(res.locals.currentUser){
            const { id } = res.locals.currentUser; //ログイン中のユーザーのID
            const loginUser = await User.findById(id); //ログイン中のユーザーの情報を全て取得
            return loginUser.image;
        }
        return "";
    }catch(e){
        console.log(e);
        return "";
    }
};