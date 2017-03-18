import { async, inject, TestBed } from '@angular/core/testing';

import { db, model } from 'baqend';

const defaultTags = [{
    alias: 'cat1',
    name: 'kategorie',
    id: '1'
}] as model.Tag[];

const operations = {
    ascending: (field: string) => {
        return {
            resultList: () => Promise.resolve(defaultTags)
        }
    }
}

import { TagService } from './tag.service';

describe('TagService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                TagService
            ]
        });

        db.Tag = {
            find: () => operations
        } as any;
    });

    it('getAll - should get all tags', async(inject([TagService], (service: TagService) => {
        spyOn(db, 'ready').and.returnValue(Promise.resolve());

        service
            .getAll()
            .then(tags => {
                expect(tags).toEqual(defaultTags);

                // second request should use cached tags
                spyOn(db.Tag, 'find');
                return service.getAll();
            })
            .then((tags) => {
                expect(tags).toEqual(defaultTags);
                expect(db.Tag.find).not.toHaveBeenCalled();
            });
    })));

    it('getByName - should get tag by name', async(inject([TagService], (service: TagService) => {
        spyOn(db, 'ready').and.returnValue(Promise.resolve());

        service
            .getByAlias('cat1')
            .then(tag => {
                expect(tag).toEqual(defaultTags[0]);

                // second request should use cached tags
                spyOn(db.Tag, 'find');
                return service.getByAlias('cat1');
            })
            .then((tag) => {
                expect(tag).toEqual(defaultTags[0]);
                expect(db.Tag.find).not.toHaveBeenCalled();
            });
    })));

    it('getForPost - should get tags for post', inject([TagService], (service: TagService) => {
        service
            .getAll()
            .then((tags) => {
                expect(service.getForPost({tags: new Set(defaultTags)} as model.Post)).toEqual(tags);
            });
    }));
});
