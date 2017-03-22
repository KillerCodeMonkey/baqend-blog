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
        const postQuery = db.Post.find().le('publishedAt', new Date(Date.now()))
        let postPromise = postQuery.descending('date').resultList();

        if (tagAlias) {
            postPromise = this.tagService
                .getByAlias(tagAlias)
                .then((tag) => {
                    return postQuery.in('tags', tag.id).descending('date').resultList();
                });
        }

        return postPromise.then((posts: model.Post[]) => {
            posts.forEach((post) => {
                post.text = this.converter.makeHtml(post.text);
            });

            return posts;
        });
    }

    get(slug: string): Promise<model.Post> {
        return db.Post.find().equal('slug', slug).singleResult()
            .then((post: model.Post) => {
                if (!post) {
                    throw new Error('not_found');
                }

                post.text = this.converter.makeHtml(post.text);

                return post;
            });
    }
}
