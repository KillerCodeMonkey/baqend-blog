import { async, fakeAsync, tick, inject, TestBed } from '@angular/core/testing';
import { BaseRequestOptions, Jsonp, JsonpModule, Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { InstagramService, InstgramPost } from './instagram.service';

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

describe('InstagramService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                InstagramService,

                MockBackend,
                BaseRequestOptions,
                {
                    provide: Jsonp,
                    useFactory: (backend: MockBackend, options: BaseRequestOptions) => new Jsonp(backend, options),
                    deps: [MockBackend, BaseRequestOptions]
                }
            ],
            imports: [
                JsonpModule
            ]
        });
    });

    describe('getRecent', () => {
        it('should return instagram posts for "self" per default', async(inject([InstagramService, MockBackend], (service: InstagramService, mockBackend: MockBackend) => {

            let response = new ResponseOptions({
                body: JSON.stringify({ data: defaultPosts })
            });

            const baseResponse = new Response(response);

            mockBackend.connections.subscribe(
                (c: MockConnection) => {
                    expect(c.request.url).toMatch('/self/media/recent');
                    c.mockRespond(baseResponse)
                }
            );

            service.getRecent().then((result) => {
                expect(result).toEqual(defaultPosts);
            });
        })));

        it('should return instagram posts for "user-id" per default', async(inject([InstagramService, MockBackend], (service: InstagramService, mockBackend: MockBackend) => {

            let response = new ResponseOptions({
                body: JSON.stringify({ data: defaultPosts })
            });

            const baseResponse = new Response(response);

            mockBackend.connections.subscribe(
                (c: MockConnection) => {
                    expect(c.request.url).toMatch('/test/media/recent');
                    c.mockRespond(baseResponse)
                }
            );

            service.getRecent('test').then((result) => {
                expect(result).toEqual(defaultPosts);
            });
        })));
    });
});
