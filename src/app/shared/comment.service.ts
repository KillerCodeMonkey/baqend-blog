import { Injectable } from '@angular/core';
import { db, model, query } from 'baqend';

export interface CommentData {
    text: string;
    name: string;
    email?: string;
}

export class CommentService {
    comments: model.Comment[];
    commentsByPosts = {};

    create(commentData: CommentData, post: model.Post): Promise<model.Comment> {
        const comment = new db.Comment(commentData);
        comment.post = post;
        let commentList = this.commentsByPosts[post.id];

        return comment.save({refresh: true}).then(comment => {
            if (this.commentsByPosts[post.id]) {
                commentList.push(comment)
            }

            return comment;
        });
    }

    getForPost(post: model.Post): Promise<model.Comment[]> {
        if (this.commentsByPosts[post.id]) {
            return Promise.resolve(Array.from(this.commentsByPosts[post.id]));
        }
        return db.Comment
            .find()
            .equal('post', post.id)
            .resultList()
            .then(comments => {
                this.commentsByPosts[post.id] = comments;
                return Array.from(comments);
            });
    }
}
