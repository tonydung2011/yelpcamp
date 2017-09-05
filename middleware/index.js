// middleware define
var middleware = {};

middleware.isLoggedIn = function (req, res, next){
    if (req.isAuthenticated()){
        return next();
    }else{
        res.redirect("/login");
    }
}

middleware.isCampgroundOwnerShip = function (req, res, next){
    if (req.params.id && req.isAuthenticated()){
        if (req.params.id.equals(req.user._id)){
            next();
        }else{
            res.redirect("back");
        }
    }else{
        res.redirect("back");
    }
}

module.exports = middleware;