const db = require('./../db_connection');

class Post {

    constructor({id, title, content, author}) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.author = author;
    }

    static async getAll() {
        db.query('SELECT * FROM posts', function (error, results, fields) {
            if (error) throw error;

            if(results.length > 0){
                console.log(results)
                return results
            }else{
                return Error('None found')
            }

        });
    }

}


module.exports = Post;