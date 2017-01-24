
import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

import { async, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { model } from 'baqend';

import { FooterComponent } from './footer.component';
import { TagService } from '../shared';

const tags = [{
    id: '123',
    name: 'Test',
    alias: 'test'
}]

class TagServiceStub {
    getAll(): Promise<model.Tag[]> {
        return Promise.resolve(tags);
    }
}

@Component({
    template: ''
})
class DummyComponent {}

describe('Footer', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                FooterComponent,
                DummyComponent
            ],
            providers: [{
                provide: TagService,
                useClass: TagServiceStub
            }],
            imports: [
                CommonModule,
                RouterTestingModule.withRoutes([{
                    path: 'kategorie/:tag',
                    component: DummyComponent
                }])
            ]
        });
    });

    it ('should work', () => {
        let fixture = TestBed.createComponent(FooterComponent);

        expect(fixture.componentInstance instanceof FooterComponent).toBe(true, 'should create FooterComponent');
    });

    it('should render content', async(inject([Location], (location: Location) => {
        let fixture = TestBed.createComponent(FooterComponent);

        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('footer')).toBeDefined();

        fixture.whenStable().then(() => {
            expect(fixture.componentInstance.tags).toBe(tags);
            fixture.detectChanges();

            expect(fixture.nativeElement.querySelectorAll('li').length).toBe(1);
            expect(fixture.nativeElement.querySelector('li > a').href).toMatch('/kategorie/' + tags[0].alias);
        });
    })));
});
