import { Injectable } from '@angular/core';
import { db, model, query } from 'baqend';

import { Converter } from 'showdown';

import { TagService } from './tag.service';

@Injectable()
export class PostService {
    tagID: string;

    converter = new Converter();

    constructor(
        private tagService: TagService
    ) {}

    getAll(tagAlias?: string): Promise<model.Post[]> {
        let req = db.Post.find();

        if (tagAlias) {
            return this.tagService
                .getByAlias(tagAlias)
                .then((tag: model.Tag) => {
                    return this.requestPosts(req.in('tags', tag.id));
                 });
        }

        return this.requestPosts(req);
    }

    get(slug: string): Promise<model.Post> {
        return db.Post.find()
            .equal('slug', slug)
            .singleResult({depth: 1})
            .then((post: model.Post) => {
                if (!post) {
                    throw new Error('not_found');
                }

                if (!post.comments) {
                    post.comments = new Set<model.Comment>([]);
                }

                post.text = this.converter.makeHtml(post.text);

                return post;
            });
    }

    addComment(post: model.Post, comment: model.Comment): Promise<model.Post> {
        post.comments.add(comment);

        return post.save({refresh: true});
    }

    private requestPosts(req: query.Filter<model.Post>): Promise<model.Post[]> {
        return req.descending('date')
            .limit(30)
            .resultList({depth: 1})
            .then((posts: model.Post[]) => {
                posts.forEach((post) => {
                    post.text = this.converter.makeHtml(post.text);

                    if (!post.comments) {
                        post.comments = new Set<model.Comment>([]);
                    }
                });

                return posts;
            });
    }
}
