import { db, model } from 'baqend';

import { Converter } from 'showdown';

export class PostService {
    converter = new Converter();

    getAll(): Promise<model.Post[]> {
        return db.Post.find()
            .descending("date")
            .limit(30)
            .resultList()
            .then((posts) => {
                posts.forEach((post) => {
                    post.text = this.converter.makeHtml(post.text);
                });

                return posts;
            });
    }
}