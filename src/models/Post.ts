import Database from "../providers/Database";
import { IPost } from "../interfaces/models/post";
import Log from "../middlewares/Log";
import { TClassCallbackFunc } from "./types";
import { EUpdateRatingParam } from "./constants";

class Post {
  private db;
  private listPerPage: number;
  constructor() {
    this.db = Database.db;
    this.listPerPage = 10;
  }
  public createPostTable() {
    this.db.run(
      `
      CREATE TABLE post (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      content TEXT,
      author INTEGER,
      readTime INTEGER,
      rating INTEGER,
      FOREIGN KEY(author) REFERENCES user(id)
      )
    `,
      (err) => {
        if (err) {
          Log.error(`${Post.name}:${this.createPostTable.name} error while creating table`);
        }
      }
    );
  }
  public create(_post: IPost, _cb: TClassCallbackFunc) {
    _post.readTime = Math.round(_post.content.split(" ").length / 200);
    _post.rating = 0;
    const insert = "INSERT INTO post (title, content, author, readTime, rating) VALUES (?,?,?,?,?)";
    this.db.run(insert, [_post.title, _post.content, _post.author, _post.readTime, _post.rating], (_err: Error, _result: any) => {
      if (_err) {
        Log.error(`${Post.name}:${this.create.name} error while inserting table`);
        return _cb(_err, _result);
      } else {
        return _cb(null, _result);
      }
    });
  }
  public findOne(_id: number, _cb: TClassCallbackFunc) {
    const sql = "select * from post where id = ?";
    this.db.get(sql, [_id], (_err, _row) => {
      if (_err) {
        Log.error(`${Post.name}:${this.findOne.name} error while selecting table`);
        return _cb(_err, _row);
      } else {
        return _cb(null, _row);
      }
    });
  }
  public find(_page: number = 1, _cb: TClassCallbackFunc) {
    const offset = (_page - 1) * this.listPerPage;
    const sql = "SELECT * FROM post LIMIT ?,?";
    const params = [offset, this.listPerPage];
    this.db.all(sql, params, (_err, _row) => {
      if (_err) {
        Log.error(`${Post.name}:${this.find.name} error while selecting table`);
        return _cb(_err, _row);
      } else {
        return _cb(null, _row);
      }
    });
  }
  public findByAuthor(_author: number = 1, _cb: TClassCallbackFunc) {
    const sql = "SELECT * FROM post where author = ?";
    this.db.all(sql, [_author], (_err, _row) => {
      if (_err) {
        Log.error(`${Post.name}:${this.findByAuthor.name} error while selecting table`);
        return _cb(_err, _row);
      } else {
        return _cb(null, _row);
      }
    });
  }
  public updateRating(_update: EUpdateRatingParam, _id: number, _cb: TClassCallbackFunc) {
    this.findOne(_id, (err, post: IPost) => {
      if (err) {
        Log.error(`${Post.name}:${this.updateRating.name} error while finding table`);
        return _cb(new Error("error while finding table"), null);
      }

      const sql = `
      UPDATE post set 
      rating = COALESCE(?,rating), 
      WHERE id = ?`;
      const rating = post.rating ? post.rating + _update : _update;
      const params = [rating, _id];
      this.db.run(sql, params, (_err: Error | null, _row: any) => {
        if (_err) {
          Log.error(`${Post.name}:${this.find.name} error while selecting table`);
          return _cb(_err, _row);
        } else {
          return _cb(null, _row);
        }
      });
    });
  }
}
export default new Post();
