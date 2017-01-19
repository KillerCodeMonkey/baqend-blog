import { async, inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BaseRequestOptions, Http, ConnectionBackend, ResponseOptions, Response } from '@angular/http';

const post = {
    title: 'Test',
    text: 'Test',
    slug: 'test'
}

import { PostService } from './post.service';

describe('PostService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                PostService,
                BaseRequestOptions,
                MockBackend,
                {
                    provide: Http,
                    useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
                        return new Http(backend, defaultOptions);
                    },
                    deps: [MockBackend, BaseRequestOptions]
                },
            ]
        });
    });

    it('should work', async(inject([PostService, MockBackend], (service: PostService, backend: MockBackend) => {
        backend.connections.subscribe((connection: MockConnection) => {
            let options = new ResponseOptions({
                body: JSON.stringify([post])
            });
            connection.mockRespond(new Response(options));
        });
        
        service
            .getAll()
            .then(books => {
                expect(books).toEqual([post]);
            });
    })));
});