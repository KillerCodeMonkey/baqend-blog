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
import { CommentService, CommentData, PostService } from '../shared';

let post = {
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
    addComment(post: model.Post, comment: model.Comment) {
        post.comments.add(comment);
        return Promise.resolve(post);
    }
}

class CommentServiceStub {
    create(comment: CommentData): Promise<model.Comment> {
        return Promise.resolve(comment);
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
                provide: ActivatedRoute,
                useValue: { params: Observable.of({'slug': 'test'}) }
            }],
            imports: [
                CommonModule,
                ReactiveFormsModule,
                RouterTestingModule,
                MetaModule.forRoot()
            ]
        });
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

    it('should redirect to home on click', fakeAsync(inject([Router, Location], (router: Router, location: Location) => {
        spyOn(location, 'back');

        let fixture = TestBed.createComponent(DetailComponent);
        fixture.detectChanges();
        tick();

        fixture.detectChanges();
        tick();

        fixture.nativeElement.querySelector('button.btn-primary').click();

        fixture.detectChanges();
        tick();

        expect(location.back).toHaveBeenCalled();
    })));

    it('createComment should create and add comment', fakeAsync(() => {
        let fixture = TestBed.createComponent(DetailComponent);
        fixture.componentInstance.post = post;

        expect(fixture.componentInstance.post.comments.size).toBe(0);

        fixture.componentInstance.createComment(comment as CommentData);
        fixture.detectChanges();
        tick();

        expect(fixture.componentInstance.post.comments.size).toBe(1);
    }));

    it('createComment should reset captcha', fakeAsync(() => {
        let fixture = TestBed.createComponent(DetailComponent);
        fixture.componentInstance.post = post;
        fixture.componentInstance.captcha = {
            task: '123',
            solution: 12
        };

        fixture.componentInstance.createComment(comment as CommentData);
        fixture.detectChanges();
        tick();

        expect(fixture.componentInstance.captcha).not.toEqual({
            task: '123',
            solution: 12
        });
    }));
});
