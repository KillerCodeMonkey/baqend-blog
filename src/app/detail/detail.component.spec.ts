import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

import { async, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Observable } from 'rxjs/Rx';

import { model } from 'baqend';

import { DetailComponent } from './detail.component';
import { PostService } from '../shared';

class PostServiceStub {
    get(slug: string): Promise<model.Post> {
        return Promise.resolve({
            title: 'Test',
            text: 'Test',
            slug: 'test'
        });
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
            expect(fixture.componentInstance.post).toEqual({
                title: 'Test',
                text: 'Test',
                slug: 'test'
            });
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

        fixture.nativeElement.querySelector('button').click();
        fixture.detectChanges();
        tick();

        expect(location.back).toHaveBeenCalled();
    })));
});