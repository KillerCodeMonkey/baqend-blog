import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PostService } from './shared/post.service';

import { db } from 'baqend';

@NgModule({
    imports: [
        BrowserModule
    ],
    providers: [
        PostService
    ],
    declarations: [
        AppComponent
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule {
    constructor() {
        db.connect('blog', true);
    }
}