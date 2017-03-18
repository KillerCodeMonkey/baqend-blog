
import { Component } from '@angular/core';
import { CommonModule, Location, NgFor } from '@angular/common';
import { By } from '@angular/platform-browser';

import { async, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { model } from 'baqend';

import { FooterComponent } from './footer.component';
import { InstagramService, InstgramPost, TagService } from '../shared';

const tags = [{
    id: '123',
    name: 'Test',
    alias: 'test'
}] as model.Tag[]

class TagServiceStub {
    getAll(): Promise<model.Tag[]> {
        return Promise.resolve(tags);
    }
}

const defaultPosts = [{
    tags: ['test'],
    images: {
        thumbnail: {
            width: 150,
            height: 150,
            url: 'https://scontent.cdninstagram.com/t51.2885-15/s150x150/e35/16464042_1848377825436846_7593857214209589248_n.jpg?ig_cache_key=MTQ0Mjc4MTQyMTc4NTkxMjk5MA%3D%3D.2'
        },
        low_resolution: {
            width: 150,
            height: 150,
            url: 'https://scontent.cdninstagram.com/t51.2885-15/s150x150/e35/16464042_1848377825436846_7593857214209589248_n.jpg?ig_cache_key=MTQ0Mjc4MTQyMTc4NTkxMjk5MA%3D%3D.2'
        },
        standard_resolution: {
            width: 150,
            height: 150,
            url: 'https://scontent.cdninstagram.com/t51.2885-15/s150x150/e35/16464042_1848377825436846_7593857214209589248_n.jpg?ig_cache_key=MTQ0Mjc4MTQyMTc4NTkxMjk5MA%3D%3D.2'
        }
    },
    type: 'image',
    id: 'test',
    user: {
        username: 'test',
        id: 'test',
        profile_picture: 'https://scontent.cdninstagram.com/t51.2885-19/s150x150/14727565_1850907555190861_5309271844979736576_a.jpg'
    },
    link: 'https://www.instagram.com/p/BQFyg8WFRae/',
    created_time: Date.now().toString(),
    caption: {
        text: 'test',
        created_time: Date.now().toString(),
        from: {
            username: 'test',
            id: 'test',
            profile_picture: 'https://scontent.cdninstagram.com/t51.2885-19/s150x150/14727565_1850907555190861_5309271844979736576_a.jpg'
        }
    },
    likes: {
        count: 500000
    }
}] as InstgramPost[];

class InstagramServiceStub {
    getRecent(user?: string): Promise<InstgramPost[]> {
        return Promise.resolve(defaultPosts);
    }
}

const instagramQuery = '.instgram-box';
const tagQuery = 'ul.category-list > li';

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
            }, {
                provide: InstagramService,
                useClass: InstagramServiceStub
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
            expect(fixture.componentInstance.instagramPosts).toBe(defaultPosts);
            fixture.detectChanges();

            const tagsElements = fixture.nativeElement.querySelectorAll(tagQuery);
            expect(tagsElements.length).toBe(1);
            expect(tagsElements[0].querySelector('a').href).toMatch('/kategorie/' + tags[0].alias);

            const instagramElements = fixture.nativeElement.querySelectorAll(instagramQuery);
            expect(instagramElements.length).toBe(1);
            expect(instagramElements[0].querySelector('a').href).toMatch('instagram.com/p/BQFyg8WFRae');
        });
    })));
});
