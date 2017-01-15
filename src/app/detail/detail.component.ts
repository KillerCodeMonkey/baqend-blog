import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { db, model } from 'baqend';

import { PostService } from '../shared';

@Component({
    templateUrl: './detail.component.html'
})
export class DetailComponent implements OnInit {
    post: model.Post;

    constructor(private postService: PostService, private route: ActivatedRoute) {}

    ngOnInit() {
        this.route.params
            .switchMap((params: Params) => this.postService.get(params['slug']))
            .subscribe((post: model.Post) => this.post = post);
    }
}
