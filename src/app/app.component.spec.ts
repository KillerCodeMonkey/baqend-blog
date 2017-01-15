import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';

import { AppComponent } from './app.component';

@Component({
    selector: 'blog-footer',
    template: '<div></div>'
})
class BlogFooterStub {}

@Component({
    selector: 'blog-navigation',
    template: '<div></div>'
})
class BlogNavigationStub {}

describe('App', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent,

                BlogFooterStub,
                BlogNavigationStub
            ],
            imports: [
                RouterTestingModule
            ]
        });
    });
    it ('should work', () => {
        let fixture = TestBed.createComponent(AppComponent);

        expect(fixture.componentInstance instanceof AppComponent).toBe(true, 'should create AppComponent');
    });

    it('should render content', () => {
        let fixture = TestBed.createComponent(AppComponent);

        expect(fixture.nativeElement.querySelector('main')).toBeDefined();
        expect(fixture.nativeElement.querySelector('router-outlet')).toBeDefined();
    })
});