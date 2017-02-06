import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Params } from '@angular/router';
import { db, model } from 'baqend';

import { PostService } from '../shared';

@Component({
    templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit {
    posts: model.Post[] = [];

    constructor(
        private postService: PostService,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.route.params
            .switchMap((params: Params) => this.postService.getAll(params['tag']))
            .subscribe((posts: model.Post[]) => this.posts = posts);
    }
}
