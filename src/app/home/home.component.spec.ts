import { Component } from '@angular/core';

import { async, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { model } from 'baqend';

import { HomeComponent } from './home.component';
import { PostService } from '../shared';

class PostServiceStub {
    getAll(): Promise<model.Post[]> {
        return Promise.resolve([{
            title: 'Test',
            text: 'Test'
        }, {
            title: 'Test2',
            text: 'Test2'
        }]);
    }
}

@Component({
    template: '<div></div>'
})
class DummyComponent {} 

describe('Home', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                HomeComponent,
                DummyComponent
            ],
            providers: [{
                provide: PostService,
                useClass: PostServiceStub
            }],
            imports: [
                RouterTestingModule
            ]
        });
    });
    it ('should work', () => {
        let fixture = TestBed.createComponent(HomeComponent);

        expect(fixture.componentInstance instanceof HomeComponent).toBe(true, 'should create HomeComponent');
    });

    it('should render content', fakeAsync(() => {
        let fixture = TestBed.createComponent(HomeComponent);
        
        // ngOnInit
        fixture.detectChanges();
        tick();

        // getAll
        fixture.detectChanges();
        tick();

        expect(fixture.componentInstance.posts).toBeDefined();
        expect(fixture.componentInstance.posts.length).toBe(2);
        expect(fixture.nativeElement.querySelectorAll('h3').length).toBe(2);
    }));
});