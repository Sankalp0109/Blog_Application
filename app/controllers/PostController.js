const { BlogPost, Admin, AuditLog, Comment} = require('../models');
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const iv = crypto.randomBytes(16);
const key = crypto.randomBytes(32);
const algorithm = "aes-256-cbc";
const createBlogPost = async (req, res) => {
  const { title, content, tags, category } = req.body;
  const post = await BlogPost.create({
    title: title,
    content: content,
    tags: tags,
    AdminAdminId: req.session.user.AdminId,
    CategoryId: category,
    image: req.file.filename,
  });
  await AuditLog.create({
    UserEmail: req.session.user.email,
    Action: 'CREATE',
    PostId: post.postId,
});
  req.flash('success-message', "Post Created Successfully");
  res.redirect('/');
};

const getAllPost = async (req, res) => {
  const { page = 1, limit = 6 } = req.query;

  try {
    const offset = (page - 1) * limit;
    const result = await BlogPost.findAndCountAll({
      offset,
      limit: parseInt(limit),
    });
    
//     const BlogDetails = await Promise.all(
//       result.rows.map(async (ele, ind) => {
//         ele.dataValues.postId = encrypt(`${ele.dataValues.postId}`);
//         return { ...ele.dataValues };
//       })
//     );
    const totalPages = Math.ceil(result.count / parseInt(limit));

    res.json({
      posts: result.rows,
      total: result.count,
      totalPages,
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const getPostById = async (req, res) => {
  const postId = req.params.postId;
  try {
    const post = await BlogPost.findByPk(postId,{
      include: [Comment,Admin]
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.locals.session = req.session;
    //const admin = await Admin.findOne({ where: { AdminId: post.AdminAdminId } });
    if (req.query.format === 'json') {
      res.json(post);
    } else {
      res.render('Post', { post: post, isAuth: req.session.isAuthenticated,});
    }
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const updatePostById = async (req, res) => {
  const postId = req.params.postId;
  const { content, title, tags } = req.body;

  try {
    const post = await BlogPost.findByPk(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    if (title != null)
      post.title = title;
    if (content != null)
      post.content = content;
    if (tags != null)
      post.tags = tags;
    await post.save();

   
    res.render('UpdatePost', { message: "Post Updated Successfully" });
  } catch (error) {
    console.error('Error updating post content:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const deletePostById = async (req, res) => {
  const postId = req.params.postId;

  try {
    const post = await BlogPost.findByPk(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });

    }

    await post.destroy();
    console.log('post deleted');
    res.render('Home', { isAuth: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const getPostByCategory = async (req, res) => {
  const id = req.params.catId;

  try {
    const postsWithCategory = await BlogPost.findAll({
      where: {
        CategoryId: id
      },
    });

    res.render('AllPost', { posts: postsWithCategory, category: "category" });
  } catch (error) {
    console.error('Error fetching posts by tag:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
const getPostByTag = async (req, res) => {
  const tag = req.params.tag;

  try {
    const postsWithTag = await BlogPost.findAll({
      where: {
        tags: {
          [Op.like]: `%${tag}%`,
        },
      },
    });
    res.render('AllPost', { posts: postsWithTag, category: tag });
  } catch (error) {
    console.error('Error fetching posts by tag:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, './static/Banner')
  },
  filename: function (req, file, cb) {
    return cb(null, Date.now() + path.extname(file.originalname));
  }
})

const uploadFile = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    console.log('multer called');
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") cb(null, true);
    else {
      cb(null, false);
      return cb('ONLY JPEG, JPG, PNG ARE ALLOWED');
    }
  },
  limits: { fileSize: 3 * 1024 * 1024 }

}).single('image');

const saveLog = (operation) => {
  console.log('save log called')
  return async (req, res, next) => {
      try {
        // console.log(req.session.user.email)
          await AuditLog.create({
              UserEmail: req.session.user.email,
              Action: operation,
              PostId: req.params.postId,
          });
          next();
      } catch (error) {
          console.error('Error creating audit log entry:', error);
      }
  }
};
const getAuditLogs =  (req,res)=>{
   AuditLog.findAll()
    .then((auditLogs) => {
      res.render('AuditLogs',{logs:auditLogs});
    })
    .catch((error) => {
      console.error('Error retrieving audit logs:', error);
    });
}

function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}
function decrypt(encryptedText) {
  try {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.log(error);
    return "error";
  }
}
// const originalText = 'This is a secret message';
// const encryptedData = encrypt(originalText);

// console.log('Encrypted Data:', encryptedData);

// const decryptedText = decrypt(encryptedData);
// console.log('Decrypted Text:', decryptedText);


const addComment = async (req,res)=>{
  const blogId = req.params.id;
  const {name, comment} = req.body;
  await Comment.create({
    name:name,
    comment:comment,
    BlogPostPostId:blogId
  });
  return res.redirect(`/post/byid/${blogId}`);
}
const getCommentsByBlogPostId = async (req,res) => {
  const blogPostId = req.params.id;
  try {
    const blogPostWithComments = await BlogPost.findByPk(blogPostId, {
      include: [Comment,Admin]
    });

    if (!blogPostWithComments) {
      console.log(`BlogPost with id ${blogPostId} not found.`);
      return null;
    }

    //const comments = blogPostWithComments.Comments;
    // return comments;
    res.render(blogPostWithComments);
  } catch (error) {
    console.error('Error retrieving comments:', error);
    throw error;
  }
};

const setCommentVisibility = async (req, res) => {
  try {
    const blogId = req.params.id;
    const commentId = req.query.comment;
    const comment = await Comment.findByPk(commentId);
    console.log(blogId);
    console.log(commentId);
    console.log(comment);

    if (!comment) {
      return res.status(404).json({ error: 'comment not found' });
    }

    const action = req.query.action;

    if (action === 'delete') {
      await comment.destroy();
      return res.redirect(`/post/byid/${blogId}`);
    } else if (action === 'toggle') {
      await comment.update({ isApproved: !comment.isApproved });
      return res.redirect(`/post/byid/${blogId}`);
    } else {
      return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('Error managing comment:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}


module.exports = {
  createBlogPost,
  getAllPost,
  getPostById,
  updatePostById,
  deletePostById,
  getPostByTag,
  getPostByCategory,
  uploadFile,
  saveLog,
  getAuditLogs,
  addComment,
  getCommentsByBlogPostId,
  setCommentVisibility,
};
