import Post from "./models/Post";
import User from "./models/User";
import Database from "./providers/Database";

Database.init();

User.createUserTable();
Post.createPostTable();
