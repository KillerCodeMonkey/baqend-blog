import { async, inject, TestBed } from '@angular/core/testing';

import { db, model } from 'baqend';

const posts = [{
    title: 'Test Blog',
    text: '## Title',
    slug: 'test'
}] as model.Post[];

const operations = {
    descending: (field: string) => {
        return {
            limit: (count: number) => {
                return {
                    resultList: () => Promise.resolve(posts)
                };
            }
        }
    },
    equal: (field: string, value: any) => {
        return {
            singleResult: () => Promise.resolve(posts[0])
        };
    }
}

import { PostService } from './post.service';

describe('PostService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                PostService
            ]
        });
        db.Post = {
            find: () => operations
        } as any;
    });

    it('getAll - should get all posts', async(inject([PostService], (service: PostService) => {

        service
            .getAll()
            .then(posts => {
                expect(posts).toEqual(posts);
                expect(posts[0].text).toBe('<h2 id="title">Title</h2>');
            });
    })));

    it('get - should get a single post', async(inject([PostService], (service: PostService) => {

        service
            .get('test')
            .then(post => {
                expect(post).toEqual(posts[0]);
                expect(post.text).toBe('<h2 id="title">Title</h2>');
            });
    })));
});
