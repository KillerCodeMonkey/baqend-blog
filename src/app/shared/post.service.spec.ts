import { async, inject, TestBed } from '@angular/core/testing';

import { db, model } from 'baqend';

import { TagService } from './tag.service';

let defaultPosts = [{
    title: 'Test Blog',
    text: '## Title',
    slug: 'test'
}] as model.Post[];

class TagStub {
    getByAlias(): Promise<model.Tag> {
        return Promise.resolve({
            id: '1',
            alias: 'cat1',
            name: 'Kategorie 1'
        });
    }
}

const operations = {
    descending: (field: string) => {
        return {
            limit: (count: number) => {
                return {
                    resultList: () => Promise.resolve(defaultPosts)
                };
            }
        }
    },
    equal: (field: string, value: any) => {
        return {
            singleResult: () => Promise.resolve(defaultPosts[0])
        };
    },
    in: (field: string, value: any) => {
        return {
            descending: (field: string) => {
                return {
                    limit: (count: number) => {
                        return {
                            resultList: () => Promise.resolve(defaultPosts)
                        };
                    }
                }
            }
        }
    }
}

class PostStub {
    comments: Set<model.Post>;
    title: String;
    text: String;

    constructor(data: any) {
        this.comments = data.comments;
        this.title = data.title;
        this.text = data.text;
    }

    static find() { return operations; }

    save() {}
}

import { PostService } from './post.service';

describe('PostService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                PostService,
                {
                    provide: TagService,
                    useClass: TagStub
                }
            ]
        });
        db.Post = PostStub as any;
    });

    describe('getAll', () => {
        it('getAll - should get all posts', async(inject([PostService], (service: PostService) => {

            service
                .getAll()
                .then(posts => {
                    expect(posts).toEqual(defaultPosts);
                    expect(posts[0].text).toBe('<h2 id="title">Title</h2>');
                });
        })));

        it('getAll - should get all posts with special tag', async(inject([PostService], (service: PostService) => {

            service
                .getAll('test')
                .then(posts => {
                    expect(posts).toEqual(defaultPosts);
                    expect(posts[0].text).toBe('<h2 id="title">Title</h2>');
                });
        })));
    });

    describe('getAll', () => {
        it('get - should get a single post without tag', async(inject([PostService], (service: PostService) => {

            service
                .get('test')
                .then(post => {
                    expect(post).toEqual(defaultPosts[0]);
                    expect(post.text).toBe('<h2 id="title">Title</h2>');
                });
        })));

        it('get - should throw error if nothing found', async(inject([PostService], (service: PostService) => {
            const backupDefaultPosts = defaultPosts;

            defaultPosts = [];

            service.get('test')
                .then(post => expect(true).toBe(false))
                .catch(e => expect(e.message).toBe('not_found'));
        })));
    });

    describe('addComment', () => {
        it('should add comment', async(inject([PostService], (service: PostService) => {
            let post = new db.Post({
                comments: new Set<model.Post>(),
                title: 'huhu',
                text: '1234'
            });

            let comment = new db.Comment({
               text: 'test',
                name: 'olaf',
                email: 'olda@test.local'
            });

            spyOn(post.comments, 'add').and.callThrough();
            spyOn(post, 'save');

            service
                .addComment(post, comment);

            expect(post.comments.add).toHaveBeenCalledWith(comment);
            expect(post.save).toHaveBeenCalled();
        })));
    });
});
