import { async, TestBed } from '@angular/core/testing';

import { model } from 'baqend';

import { FooterComponent } from './footer.component';
import { TagService } from '../shared';

class TagServiceStub {
    get(slug: string): Promise<model.Tag> {
        return Promise.resolve({
            id: '123',
            name: 'Test',
            alias: 'test'
        });
    }
}

describe('Footer', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                FooterComponent
            ],
            providers: [{
                provide: TagService,
                useClass: TagServiceStub
            }]
        });
    });

    it ('should work', () => {
        let fixture = TestBed.createComponent(FooterComponent);

        expect(fixture.componentInstance instanceof FooterComponent).toBe(true, 'should create FooterComponent');
    });

    it('should render content', async(() => {
        let fixture = TestBed.createComponent(FooterComponent);
        
        // ngOnInit
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('footer')).toBeDefined();
    }));
});