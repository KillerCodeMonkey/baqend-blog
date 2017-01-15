import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

describe('App', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent
            ],
            imports: [
                RouterTestingModule
            ]
        });
    });
    it ('should work', () => {
        let fixture = TestBed.createComponent(AppComponent);

        expect(fixture.componentInstance instanceof AppComponent).toBe(true, 'should create AppComponent');
    });

    it('should render content', () => {
        let fixture = TestBed.createComponent(AppComponent);

        expect(fixture.nativeElement.querySelector('main')).toBeDefined();
        expect(fixture.nativeElement.querySelector('router-outlet')).toBeDefined();
    })
});