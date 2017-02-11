import { NgModule, LOCALE_ID } from '@angular/core';
import { JsonpModule } from '@angular/http';
import { ReactiveFormsModule, NgModel } from '@angular/forms';
import { BrowserModule }  from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { DetailComponent } from './detail/detail.component';
import { CommentService, PostService, TagService, DB_PROVIDERS, DBService, InstagramService } from './shared';

import { AppRouter } from './app.router';

import { db } from 'baqend';

@NgModule({
    imports: [
        BrowserModule,
        JsonpModule,
        ReactiveFormsModule,

        AppRouter
    ],
    providers: [
        CommentService,
        InstagramService,
        PostService,
        TagService,
        DB_PROVIDERS,
        {
            provide: LOCALE_ID,
            useValue: 'de-DE'
        }
    ],
    declarations: [
        AppComponent,
        NavigationComponent,
        FooterComponent,
        HomeComponent,
        DetailComponent,
        NgModel
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule {
    constructor(private dbService: DBService) {}
}