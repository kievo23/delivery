function ensureAuthenticated(req, res, next){
	console.log('testing auth');
	if(req.isAuthenticated()){
		return next();
	}else{
		req.flash('error_msg','You must be logged in yah');
		req.session.returnUrl = req.originalUrl;
		res.redirect('/login');
	}
}

function ensureAdmin(req, res, next){
	if(req.isAuthenticated()){
		if(req.user.categoryId == 1){
			return next();
		}else{
			req.flash('error_msg','Sorry, You are not allowed to access this page');
			res.redirect('/');
		}
	}else{
		req.flash('error_msg','You must be logged in');
		res.redirect('/login');
	}
}

function ensureManager(req, res, next){
	if(req.isAuthenticated()){
		if(req.user.categoryId == 2 || req.user.categoryId == 1){
			return next();
		}else{
			req.flash('error_msg','Sorry, You are not allowed to access this page');
			res.redirect('/');
		}
	}else{
		req.flash('error_msg','You must be logged in');
		res.redirect('/login');
	}
}

function ensureCourier(req, res, next){
	if(req.isAuthenticated()){
		if(req.user.categoryId == 3 || req.user.categoryId == 2 || req.user.categoryId == 1){
			return next();
		}else{
			req.flash('error_msg','Sorry, You are not allowed to access this page');
			res.redirect('/');
		}
	}else{
		req.flash('error_msg','You must be logged in');
		res.redirect('/login');
	}
}

module.exports = {
	auth:ensureAuthenticated,
	admin:ensureAdmin,
  manager:ensureManager,
  courier: ensureCourier
};
