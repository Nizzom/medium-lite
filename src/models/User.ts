import bcrypt from "bcrypt";
import { IUser } from "../interfaces/models/user";
import Database from "../providers/Database";
import Log from "../middlewares/Log";
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
  public async create(_user: IUser): Promise<any> {
    return new Promise(async (done, fail) => {
      _user.rating = 0;
      const hash = await bcrypt.hash(_user.password, 10);
      const insert = "INSERT INTO user (email, password, rating) VALUES (?,?,?)";
      this.db.run(insert, [_user.email, hash, _user.rating], (_err: Error, _result: any) => {
        if (_err) {
          Log.error(`${User.name}:${this.create.name} error while inserting table`);
          return fail(_err);
        } else {
          return done(_result);
        }
      });
    });
  }
  public findOne(_id: number): Promise<any> {
    return new Promise((done, fail) => {
      const sql = "select * from user where id = ?";
      this.db.get(sql, [_id], (_err, _row) => {
        if (_err) {
          Log.error(`${User.name}:${this.findOne.name} error while selecting table`);
          return fail(_err);
        } else {
          return done(_row);
        }
      });
    });
  }
  public findOneByEmail(_email: string): Promise<any> {
    return new Promise((done, fail) => {
      const sql = "select * from user where email = ?";
      this.db.get(sql, [_email], (_err, _row) => {
        if (_err) {
          Log.error(`${User.name}:${this.findOne.name} error while selecting table`);
          return fail(_err);
        } else {
          return done(_row);
        }
      });
    });
  }
  public find(_page: number = 1): Promise<any> {
    return new Promise((done, fail) => {
      const offset = (_page - 1) * this.listPerPage;
      const sql = "SELECT * FROM user LIMIT ?,?";
      const params = [offset, this.listPerPage];
      this.db.all(sql, params, (_err, _row) => {
        if (_err) {
          Log.error(`${User.name}:${this.find.name} error while selecting table`);
          return fail(_err);
        } else {
          return done(_row);
        }
      });
    });
  }
  public updateRating(_id: number): Promise<any> {
    return new Promise(async (done, fail) => {
      const posts: any = await Post.findByAuthor(_id)
        .then((posts) => posts)
        .catch((err) => {
          Log.error(`${User.name}:${this.updateRating.name} error while finding table`);
          return fail(err);
        });
      console.log(posts);
      const rating = posts.reduce((acc, post) => acc + (post.rating ? post.rating : 0), 0);

      const sql = `
        UPDATE user SET
        rating = ?
        WHERE id = ?`;
      this.db.run(sql, [rating, _id], (_err: Error | null, _row: any) => {
        if (_err) {
          Log.error(`${User.name}:${this.updateRating.name} error while ` + _err);
          return fail(_err);
        } else {
          return done(_row);
        }
      });
    });
  }
}
export default new User();
