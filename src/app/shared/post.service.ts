import { db, model } from 'baqend';

import { Converter } from 'showdown';

export class PostService {
    converter = new Converter();

    getAll(tag?: string): Promise<model.Post[]> {
        let req = db.Post.find();

        if (tag) {
            req.in('tags', tag);
        }

        return req
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

    get(slug: string): Promise<model.Post|never> {

        return db.Post.find()
            .equal('slug', slug)
            .singleResult()
            .then((post: model.Post) => {
                if (!post) {
                    throw new Error('not_found');
                }
                post.text = this.converter.makeHtml(post.text);

                return post;
            });
    }
}
