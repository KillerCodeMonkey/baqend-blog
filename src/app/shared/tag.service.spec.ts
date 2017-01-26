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
            });
    })));
});
