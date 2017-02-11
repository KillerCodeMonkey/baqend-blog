import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

import { async, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Observable } from 'rxjs/Rx';

import { db, model } from 'baqend';

import { DetailComponent } from './detail.component';
import { CommentService, CommentData, PostService } from '../shared';

let post = {
    title: 'Test',
    text: 'Test',
    slug: 'test',
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
                RouterTestingModule.withRoutes([{
                    path: '',
                    component: DummyComponent
                }, {
                    path: ':slug',
                    component: DetailComponent
                }])
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

    it('should redirect to home on click', fakeAsync(inject([Router, Location], (router: Router, location: Location) => {
        let fixture = TestBed.createComponent(TestComponent);
        fixture.detectChanges();
        tick();

        router.navigate(['test']);
        fixture.detectChanges();
        tick();

        spyOn(location, 'back');

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

        fixture.componentInstance.createComment();
        fixture.detectChanges();
        tick();

        expect(fixture.componentInstance.post.comments.size).toBe(1);
    }));
});
