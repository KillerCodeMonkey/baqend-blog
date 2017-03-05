import { Component } from '@angular/core';

import { async, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { model, db } from 'baqend';

import { HomeComponent } from './home.component';
import { PostService, TagService } from '../shared';

import { MetaService, MetaModule } from '@nglibs/meta';

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


const tag = {
    id: '123',
    name: 'Test',
    alias: 'test'
}

class TagServiceStub {
    getByAlias(alias: string): Promise<model.Tag> {
        return Promise.resolve(tag);
    }
}

describe('Home', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                HomeComponent
            ],
            providers: [{
                provide: PostService,
                useClass: PostServiceStub
            }, {
                provide: TagService,
                useClass: TagServiceStub
            }],
            imports: [
                RouterTestingModule,
                MetaModule.forRoot()
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

    it('should set meta title and description content', fakeAsync(inject([MetaService], (metadata: MetaService) => {
        let fixture = TestBed.createComponent(HomeComponent);
        spyOn(metadata, 'setTitle');
        spyOn(metadata, 'setTag');

        // ngOnInit
        fixture.detectChanges();
        tick();

        // getTag
        fixture.detectChanges();
        tick();

        // getAllPosts
        fixture.detectChanges();
        tick();

        expect(metadata.setTitle).toHaveBeenCalledWith(tag.name);
        expect(metadata.setTag).toHaveBeenCalledWith('og:description', `Alle Blogbeiträge im Bereich ${tag.name}`);
        expect(metadata.setTag).toHaveBeenCalledWith('og:image', null);
    })));
});
