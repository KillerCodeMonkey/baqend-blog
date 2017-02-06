import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { NavigationComponent } from './navigation.component';

describe('Navigation', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                NavigationComponent
            ],
            providers:[
                RouterTestingModule
            ]
        });
    });
    it ('should work', () => {
        let fixture = TestBed.createComponent(NavigationComponent);

        expect(fixture.componentInstance instanceof NavigationComponent).toBe(true, 'should create NavigationComponent');
    });

    it('should render content', async(() => {
        let fixture = TestBed.createComponent(NavigationComponent);

        // ngOnInit
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('[role="navigation"]')).toBeDefined();
    }));
});
