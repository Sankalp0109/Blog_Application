const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  max: 5, // Max 5 requests per minute
  windowMs: 60 * 1000, // 1 minute window
  message: 'Too many requests from this IP, please try again later.',
  handler: (req, res, next) => {
    console.log('handler triggered');
    req.flash('error','Too many requests from this IP, please try again later.');
    res.redirect('/signup');
    // res.status(429).json({
    //   error: 'Rate limit exceeded',
    //   message: 'Too many requests from this IP, please try again later.',
    // });
  },
});
module.exports = {
    limiter,
}