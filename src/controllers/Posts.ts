import { NextFunction, Response, Request } from "express";
import { EUpdateRatingParam } from "../models/constants";
import { IPost } from "../interfaces/models/post";
import Post from "../models/Post";

class Posts {
  public static async show(req: any, res: Response, next: NextFunction) {
    const { id } = req.query;
    const posts = await Post.find(id).then((posts) => posts);
    res.render("pages/add-post", {
      title: "Add Post",
      posts,
      userId: req.user.id,
    });
  }
  public static async list(req: Request, res: Response, next: NextFunction) {
    const { id } = req.query;
    const posts = await Post.find(id).then((posts) => posts);
    res.render("pages/posts", {
      title: "Posts",
      posts,
    });
  }
  public static async showSingle(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const post = await Post.findOne(id)
      .then((post) => post)
      .catch((err) => {
        res.redirect("/");
      });
    res.render("pages/post", {
      title: "Post",
      post,
    });
  }
  public static async perform(req: Request, res: Response, next: NextFunction) {
    req.assert("title", "Title cannot be blank").notEmpty();
    req.assert("content", "Content is not valid").notEmpty();
    req.assert("author", "Author error").isNumeric().notEmpty();

    const errors = req.validationErrors();
    if (errors) {
      req.flash("errors", errors);
      console.log(errors);
      return res.redirect("/posts");
    }

    const data: IPost = req.body;
    const posts = await Post.create(data)
      .then(() => {
        res.redirect("/");
      })
      .catch((err) => res.redirect("/"));
  }
  public static async rating(req: Request, res: Response, next: NextFunction) {
    const { id, value } = req.query;
    let rating;
    if (value === "up") {
      rating = EUpdateRatingParam.Up;
    } else {
      rating = EUpdateRatingParam.Down;
    }
    const posts = await Post.updateRating(rating, id)
      .then(() => {
        res.redirect("/");
      })
      .catch((err) => res.redirect("/"));
  }
}
export default Posts;
