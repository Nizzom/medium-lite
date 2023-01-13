import { Application } from "express";
import Posts from "../controllers/Posts";
import Home from "../controllers/Home";
import User from "../models/User";
import Login from "../controllers/Auth/Login";
import Register from "../controllers/Auth/Register";
import Logout from "../controllers/Auth/Logout";
import Passport from "./Passport";

class Routes {
  public static init(_express: Application): Application {
    _express.get("/", Passport.isAuthenticated, Home.index);
    _express.get("/login", Login.show);
    _express.post("/login", Login.perform);
    _express.get("/post/:id", Passport.isAuthenticated, Posts.showSingle);
    _express.get("/posts", Passport.isAuthenticated, Posts.list);
    _express.get("/post", Passport.isAuthenticated, Posts.show);
    _express.post("/post", Passport.isAuthenticated, Posts.perform);
    _express.get("/rating", Passport.isAuthenticated, Posts.rating);
    _express.get("/register", Register.show);
    _express.post("/register", Register.perform);
    _express.get("/users", Passport.isAuthenticated);
    _express.get("/logout", Logout.perform);
    return _express;
  }
}
export default Routes;
