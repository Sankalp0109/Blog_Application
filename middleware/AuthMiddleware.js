const {BlogPost} = require('../app/models')
const validateUser = (req, res, next) => {
    if (req.session.user) {
    //   res.send({ loggedIn: true, user: req.session.user });
    next();
    } else {
      req.flash('error','Please Login!');
      res.redirect('/login');
      // next();
    }
  };
  const validateAdmin = (req, res, next) => {
    if (req.session.user?.isAdmin) {
    //   res.send({ loggedIn: true, user: req.session.user });
    next();
    } else {
      req.flash('message','Permission Denied');
      res.redirect('/');
      // next();
    }
  };
const checkPermission = async (req,res,next)=>{
  const postId = req.params.postId;
  const post = await BlogPost.findByPk(postId);
  if((post.AdminAdminId == req.session.user.AdminId) || req.session.user.isAdmin){
    next();
  }
  else{
    req.flash('message','Permission Denied');
    res.redirect('/');
  }
}
module.exports = { validateUser, validateAdmin, checkPermission};