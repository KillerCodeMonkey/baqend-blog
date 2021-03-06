import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { async, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Observable } from 'rxjs/Rx';

import { db, model } from 'baqend';
import { MetaService, MetaModule } from '@nglibs/meta';

import { DetailComponent, PreviewImage } from './detail.component';
import { CommentService, CommentData, PostService, TagService } from '../shared';

let post = {
    id: '234',
    title: 'Test',
    text: 'Test',
    description: '1233',
    slug: 'test',
    preview_image: {
        url: '123'
    },
    comments: new Set<model.Comment>()
} as model.Post;
let comment = {
    name: 'Test',
    text: 'Test',
    email: 'test@test.local'
} as model.Comment;

class PostServiceStub {
    get(slug: string): Promise<model.Post> {
        return Promise.resolve(post);
    }
}

class TagServiceStub {
    getForPost(post: model.Post): model.Tag[] {
        return [];
    }
}

class CommentServiceStub {
    create(comment: CommentData, post: model.Post): Promise<model.Comment> {
        return Promise.resolve(comment);
    }

    getForPost(post: model.Post): Promise<model.Comment[]> {
        return Promise.resolve([]);
    }
}

@Component({
    template: `
<router-outlet></router-outlet>
`
})
class TestComponent {}

@Component({
    template: ''
})
class DummyComponent {}

describe('Detail', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                TestComponent,
                DetailComponent,
                DummyComponent
            ],
            providers: [{
                provide: CommentService,
                useClass: CommentServiceStub
            }, {
                provide: PostService,
                useClass: PostServiceStub
            }, {
                provide: TagService,
                useClass: TagServiceStub
            }, {
                provide: ActivatedRoute,
                useValue: { params: Observable.of({'slug': 'test'}) }
            }],
            imports: [
                CommonModule,
                ReactiveFormsModule,
                RouterTestingModule,
                MetaModule.forRoot()
            ]
        }).compileComponents();
    });
    it ('should work', () => {
        let fixture = TestBed.createComponent(DetailComponent);

        expect(fixture.componentInstance instanceof DetailComponent).toBe(true, 'should create DetailComponent');
    });

    it('should render content', async(() => {
        let fixture = TestBed.createComponent(DetailComponent);
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            expect(fixture.componentInstance.post).toBeDefined();
            expect(fixture.componentInstance.post).toEqual(post);
        })

    }));

    it('should set correct meta tags', async(inject([MetaService], (metadata: MetaService) => {
        spyOn(metadata, 'setTitle');
        spyOn(metadata, 'setTag');

        let fixture = TestBed.createComponent(DetailComponent);
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            expect(fixture.componentInstance.post).toBeDefined();
            expect(fixture.componentInstance.post).toEqual(post);

            expect(metadata.setTitle).toHaveBeenCalledWith(post.title);
            expect(metadata.setTag).toHaveBeenCalledWith('og:description', post.description);

            const image = post.preview_image as PreviewImage;
            expect(metadata.setTag).toHaveBeenCalledWith('og:image', image.url);
        });
    })));

    it('should redirect to home on click', async(inject([Router, Location], (router: Router, location: Location) => {
        spyOn(location, 'back');

        let fixture = TestBed.createComponent(DetailComponent);

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            fixture.nativeElement.querySelector('button.btn-primary').click();
            fixture.detectChanges();
            return fixture.whenStable()
        }).then(() => {
            fixture.detectChanges();
            expect(location.back).toHaveBeenCalled();
        });
    })));

    it('createComment should create and add comment', async(() => {
        let fixture = TestBed.createComponent(DetailComponent);
        fixture.componentInstance.post = post;
        fixture.detectChanges();

        expect(fixture.componentInstance.comments.length).toBe(0);
        expect(fixture.componentInstance.commentSaved).toBe(false);

        fixture.componentInstance.createComment(comment as CommentData);
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.componentInstance.commentSaved).toBe(true);
        })
    }));

    it('createComment should reset captcha', async(() => {
        let fixture = TestBed.createComponent(DetailComponent);
        fixture.componentInstance.post = post;
        fixture.componentInstance.captcha = {
            task: '123',
            solution: 12
        };

        fixture.componentInstance.createComment(comment as CommentData);
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.componentInstance.captcha).not.toEqual({
                task: '123',
                solution: 12
            });
        });
    }));
});
