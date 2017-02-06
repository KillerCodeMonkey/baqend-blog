import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { db, model } from 'baqend';

import { PostService } from '../shared';

@Component({
    templateUrl: './detail.component.html'
})

export class DetailComponent implements OnInit {
    post: model.Post;
    notFound: boolean = false;

    constructor(
        private postService: PostService,
        private route: ActivatedRoute,
        private location: Location,
        private sanitizer: DomSanitizer
    ) {}

    ngOnInit() {
        this.route.params
            .switchMap((params: Params) => this.postService.get(params['slug']))
            .subscribe((post: model.Post) => {
                this.notFound = false;
                this.post = post
            }, () => this.notFound = true);
    }

    sanitize(text: string) {
        return this.sanitizer.bypassSecurityTrustHtml(text);
    }

    back() {
        this.location.back();
    }
}
