const fs = require("fs");
const Controller = require("./controller");
const qs = require("qs");
const cookie = require("qs");

let checkLoginAdmin = false;
let checkLoginUser = false;

class AuthLogin extends Controller {

    constructor() {
        super();
    }



    dashboard(req, res) {
        if (checkLoginAdmin) {
            this.dashboard(req, res)
        } else {
            this.navigation(res, '/login')
        }
    }

    home(req, res) {
        if (checkLoginUser) {
            this.home(req, res)
        } else {
            this.navigation(res, '/login')
        }
    }


}

module.exports = AuthLogin;