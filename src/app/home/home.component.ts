import { Component, OnInit } from '@angular/core';
import { db, model } from 'baqend';

import { PostService } from '../shared';

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['home.component.css']
})
export class HomeComponent implements OnInit {
    posts: model.Post[];

    constructor(private postService: PostService) {}

    ngOnInit() {
        this.postService.getAll()
            .then((posts: model.Post[]) => this.posts = posts);
    }
}
