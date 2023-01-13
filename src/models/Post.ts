import Database from "../providers/Database";
import { IPost } from "../interfaces/models/post";
import Log from "../middlewares/Log";
import { EUpdateRatingParam } from "./constants";
import User from "./User";

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
  public create(_post: IPost): Promise<any> {
    return new Promise((done, fail) => {
      _post.readTime = Math.round(_post.content.split(" ").length / 200);
      _post.rating = 0;
      const insert = "INSERT INTO post (title, content, author, readTime, rating) VALUES (?,?,?,?,?)";
      this.db.run(insert, [_post.title, _post.content, _post.author, _post.readTime, _post.rating], (_err: Error, _result: any) => {
        if (_err) {
          Log.error(`${Post.name}:${this.create.name} error while inserting table`);
          return fail(_err);
        } else {
          return done(_result);
        }
      });
    });
  }
  public findOne(_id: any): Promise<IPost> {
    return new Promise((done, fail) => {
      const sql = "select * from post where id = ?";
      this.db.get(sql, [_id], (_err: any, _row: IPost) => {
        if (_err) {
          Log.error(`${Post.name}:${this.findOne.name} error while selecting table`);
          return fail(_err);
        } else {
          return done(_row);
        }
      });
    });
  }
  public find(_page: any = 1) {
    return new Promise((done, fail) => {
      const offset = (_page - 1) * this.listPerPage;
      const sql = "SELECT * FROM post LIMIT ?,?";
      const params = [offset, this.listPerPage];
      this.db.all(sql, params, (_err, _row) => {
        if (_err) {
          Log.error(`${Post.name}:${this.find.name} error while selecting table`);
          return fail(_err);
        } else {
          return done(_row);
        }
      });
    });
  }
  public findByAuthor(_author: number = 1) {
    return new Promise((done, fail) => {
      const sql = "SELECT * FROM post where author = ?";
      this.db.all(sql, [_author], (_err, _row: IPost) => {
        if (_err) {
          Log.error(`${Post.name}:${this.findByAuthor.name} error while selecting table`);
          return fail(_err);
        } else {
          return done(_row);
        }
      });
    });
  }
  public updateRating(_update: EUpdateRatingParam, _id) {
    return new Promise(async (done, fail) => {
      const post: any = await this.findOne(_id)
        .then((post) => post)
        .catch((err) => {
          Log.error(`${Post.name}:${this.updateRating.name} error ` + err);
          return fail(err);
        });

      const sql = `
        UPDATE post SET 
        rating = ?
        WHERE id = ?`;
      const rating = post.rating ? post.rating + _update : _update;
      const params = [rating, _id];
      this.db.run(sql, params, (_err: Error | null, _row: any) => {
        if (_err) {
          Log.error(`${Post.name}:${this.find.name} error while ` + _err);
          return fail(_err);
        } else {
          User.updateRating(post.author)
            .then(() => {
              return done(_row);
            })
            .catch((err) => {
              Log.error(`${Post.name}:${this.find.name} error ` + err.message);
              return fail(err);
            });
        }
      });
    });
  }
}
export default new Post();
