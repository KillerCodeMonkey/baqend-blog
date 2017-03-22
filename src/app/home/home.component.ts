import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Params } from '@angular/router';
import { db, model } from 'baqend';
import { MetaService } from '@nglibs/meta';

import { PostService, TagService, CommentService } from '../shared';

@Component({
    templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit {
    posts: model.Post[] = [];

    constructor(
        private postService: PostService,
        private route: ActivatedRoute,
        private tagService: TagService,

        private readonly metadata: MetaService
    ) {}

    ngOnInit() {
        this.route.params
            .switchMap((params: Params) => this.tagService.getByAlias(params['tag']))
            .switchMap((tag) => {
                const title = tag ? tag.name : null;
                const description = tag ? `Alle Blogbeiträge im Bereich ${tag.name}` : 'Ein Blog rund um die Masche!';
                this.metadata.setTitle(title);
                this.metadata.setTag('og:description', description);
                this.metadata.setTag('og:image', null);

                return this.postService.getAll(tag ? tag.alias : null)
            })
            .subscribe((posts: model.Post[]) => {
                posts.forEach((post) => {
                    post.tags = new Set(this.tagService.getForPost(post));
                })
                this.posts = posts;
            });
    }
}
