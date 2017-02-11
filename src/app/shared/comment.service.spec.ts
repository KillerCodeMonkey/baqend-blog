import { async, inject, TestBed } from '@angular/core/testing';

import { db, model } from 'baqend';

const defaultComments = [{
    text: 'comment1',
    name: 'superuser',
    email: 'test@†est.local'
}, {
    text: 'comment1',
    name: 'superuser',
    email: 'test@†est.local'
}] as model.Comment[];

const operations = {
    descending: (field: string) => {
        return {
            resultList: () => Promise.resolve(defaultComments)
        }
    }
}

class CommentStub {
    text: string;
    name: string;
    email: string;

    constructor(data: CommentData) {
        this.text = data.text;
        this.name = data.name;
        this.email = data.email;
    }
    static find() { return operations }
    save() { return Promise.resolve(this) }
}

import { CommentData, CommentService } from './comment.service';

describe('CommentService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                CommentService
            ]
        });

        db.Comment = CommentStub as any;
    });

    describe('create', () => {
        it('should create new comment', async(inject([CommentService], (service: CommentService) => {
            const newComment = {
                text: 'test',
                name: '123',
                email: '1234'
            } as CommentData;

            service
                .create(newComment)
                .then(comment => {
                    expect(comment as Object).toEqual(new CommentStub(newComment));
                })
        })));
    });
});
