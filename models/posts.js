const db = require('./../db_connection');

class Post {

    constructor({id, title, content, author}) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.author = author;
    }

    static async getAll() {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM posts', function (error, results, fields) {
                if (error) {
                    reject(error);
                } else {
                    if (results.length > 0) {
                        console.log(results);
                        resolve(results);
                    } else {
                        reject(new Error('None found'));
                    }
                }
            });
        });
    }

}

module.exports = Post;
