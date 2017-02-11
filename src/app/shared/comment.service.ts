import { Injectable } from '@angular/core';
import { db, model, query } from 'baqend';

export interface CommentData {
    text: string;
    name: string;
    email?: string;
}

export class CommentService {
    comments: model.Comment[];

    create(commentData: CommentData): Promise<model.Comment> {
        const comment = new db.Comment(commentData);

        return comment.save({refresh: true});
    }
}
