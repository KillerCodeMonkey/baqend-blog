import { db, model } from 'baqend';

import { Converter } from 'showdown';

export class PostService {
    converter = new Converter();

    getAll(): Promise<model.Post[]> {
        return db.Post.find()
            .descending("date")
            .limit(30)
            .resultList()
            .then((posts: model.Post[]) => {
                posts.forEach((post) => {
                    post.text = this.converter.makeHtml(post.text);
                });

                return posts;
            });
    }

    get(slug: String): Promise<model.Post> {
        return db.Post.find()
            .equal('slug', slug)
            .singleResult()
            .then((post: model.Post) => {
                post.text = this.converter.makeHtml(post.text);

                return post;
            });
    }
}