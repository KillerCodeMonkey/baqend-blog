import { async, TestBed } from '@angular/core/testing';

import { FooterComponent } from './footer.component';

describe('Footer', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                FooterComponent
            ]
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