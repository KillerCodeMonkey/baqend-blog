import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { db, model } from 'baqend';

import { CommentService, PostService } from '../shared';

@Component({
    templateUrl: './detail.component.html'
})

export class DetailComponent implements OnInit {
    post: model.Post;
    notFound: boolean = false;

    constructor(
        private commentService: CommentService,
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
                this.post = post;
            }, () => this.notFound = true);
    }

    sanitize(text: string) {
        return this.sanitizer.bypassSecurityTrustHtml(text);
    }

    createComment() {
        this.commentService.create({
            text: 'testCommentar Supergääää',
            email: 'top@tes.locale',
            name: 'Gerd van Sittich'
        }).then(comment => {
            this.postService.addComment(this.post, comment);
        });
    }

    back() {
        this.location.back();
    }
}
