import { NextFunction, Response, Request } from "express";
import Post from "../models/Post";
import User from "../models/User";

class Home {
  public static async index(req: Request, res: Response, next: NextFunction) {
    const users = await User.find(1).then((users) => users);
    const posts = await Post.find(1).then((posts) => posts);
    res.render("pages/home", {
      title: "Home",
      users,
      posts,
    });
  }
}
export default Home;