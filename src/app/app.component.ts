import { Component, OnInit } from '@angular/core';
import { db, model } from 'baqend';

import { PostService } from './shared/post.service';

import '../../public/css/styles.css';

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    posts: model.Post[];

    constructor(private postService: PostService) {}

    ngOnInit() {
        db
            .ready()
            .then(() => {
                return this.postService.getAll();
            })
            .then((posts) => {
                this.posts = posts;
            });
    }

 }