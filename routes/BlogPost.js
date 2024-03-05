const express = require("express");
const router = express.Router();
const { BlogPost } = require("../app/models");
const { validateUser, validateAdmin, checkPermission} = require('../middleware/AuthMiddleware');
const multer = require('multer');
const postControllers = require('../app/controllers/PostController');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'static/'); 
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+file.originalname); 
    },
  });
  const upload = multer({storage: storage,
    fileFilter: (req, file, cb) => {
        console.log('multer called');
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") cb(null, true);
        else {
            cb(null, false);
            return cb('ONLY JPEG, JPG, PNG ARE ALLOWED');
        }
    },
    limits: { fileSize: 3 * 1024 * 1024 }
    
  });



router.get("/", postControllers.getAllPost);
router.get('/byid/:postId', postControllers.getPostById);
router.get('/bytag/:tag', postControllers.getPostByTag);
router.get('/bycategory/:catId', postControllers.getPostByCategory);
router.post('/comment/add/:id',postControllers.addComment);
//router.get('/comment/:id',postControllers.getCommentsByBlogPostId);
router.get('/comment/:id',postControllers.setCommentVisibility);
router.use(validateUser);
router.post("/create",upload.single('image'), postControllers.createBlogPost);
router.post('/update/:postId',checkPermission,postControllers.saveLog('UPDATE'), postControllers.updatePostById);
router.post('/delete/:postId',checkPermission,postControllers.saveLog('DELETE'), postControllers.deletePostById);
router.get('/auditlogs',validateAdmin, postControllers.getAuditLogs);



module.exports = router;