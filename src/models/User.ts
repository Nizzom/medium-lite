import bcrypt from "bcrypt";
import { IUser } from "../interfaces/models/user";
import Database from "../providers/Database";
import Log from "../middlewares/Log";
import { TClassCallbackFunc } from "./types";
import { EUpdateRatingParam } from "./constants";
import Post from "./Post";
import { IPost } from "../interfaces/models/post";

class User {
  private db;
  private listPerPage: number;
  constructor() {
    this.db = Database.db;
    this.listPerPage = 10;
  }
  public createUserTable() {
    this.db.run(
      `
        CREATE TABLE user (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE, 
          password TEXT,
          rating INTEGER,
          CONSTRAINT email_unique UNIQUE (email)
        )
    `,
      (err) => {
        if (err) {
          Log.error(`${User.name}:${this.createUserTable.name} error while creating table`);
        }
      }
    );
  }
  public async create(_user: IUser, _cb: TClassCallbackFunc) {
    _user.rating = 0;
    const hash = await bcrypt.hash(_user.password, 10);
    const insert = "INSERT INTO user (email, password, rating) VALUES (?,?,?)";
    this.db.run(insert, [_user.email, hash, _user.rating], (_err: Error, _result: any) => {
      if (_err) {
        Log.error(`${User.name}:${this.create.name} error while inserting table`);
        return _cb(_err, _result);
      } else {
        return _cb(null, _result);
      }
    });
  }
  public findOne(_id: number, _cb: TClassCallbackFunc) {
    const sql = "select * from user where id = ?";
    this.db.get(sql, [_id], (_err, _row) => {
      if (_err) {
        Log.error(`${User.name}:${this.findOne.name} error while selecting table`);
        return _cb(_err, _row);
      } else {
        return _cb(null, _row);
      }
    });
  }
  public findOneByEmail(_email: string, _cb: TClassCallbackFunc) {
    const sql = "select * from user where email = ?";
    this.db.get(sql, [_email], (_err, _row) => {
      if (_err) {
        Log.error(`${User.name}:${this.findOne.name} error while selecting table`);
        return _cb(_err, _row);
      } else {
        return _cb(null, _row);
      }
    });
  }
  public find(_page: number = 1, _cb: TClassCallbackFunc) {
    const offset = (_page - 1) * this.listPerPage;
    const sql = "SELECT * FROM user LIMIT ?,?";
    const params = [offset, this.listPerPage];
    this.db.all(sql, params, (_err, _row) => {
      if (_err) {
        Log.error(`${User.name}:${this.find.name} error while selecting table`);
        return _cb(_err, _row);
      } else {
        return _cb(null, _row);
      }
    });
  }
  public updateRating(_update: EUpdateRatingParam, _id: number, _cb: TClassCallbackFunc) {
    Post.findByAuthor(_id, (err, posts: Array<IPost>) => {
      if (err) {
        Log.error(`${User.name}:${this.updateRating.name} error while finding table`);
        return _cb(new Error("error while finding table"), null);
      }
      const rating = posts.reduce((acc, post) => (acc + (post.rating ? post.rating : 0)), 0);

      const sql = `
      UPDATE user set
      rating = COALESCE(?,rating),
      WHERE id = ?`;
      this.db.run(sql, [rating, _id], (_err: Error | null, _row: any) => {
        if (_err) {
          Log.error(`${User.name}:${this.updateRating.name} error while selecting table`);
          return _cb(_err, _row);
        } else {
          return _cb(null, _row);
        }
      });
    });
  }
}
export default new User();
