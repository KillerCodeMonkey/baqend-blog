import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { DetailComponent } from './detail/detail.component';
import { PostService, DB_PROVIDERS, DBService } from './shared';

import { AppRouter } from './app.router';

import { db } from 'baqend';

@NgModule({
    imports: [
        BrowserModule,

        AppRouter
    ],
    providers: [
        PostService,
        DB_PROVIDERS
    ],
    declarations: [
        AppComponent,
        NavigationComponent,
        FooterComponent,
        HomeComponent,
        DetailComponent
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule {
    constructor(private dbService: DBService) {}
}