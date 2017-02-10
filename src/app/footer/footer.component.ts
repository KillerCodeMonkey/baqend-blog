import { Component, OnInit } from '@angular/core';
import { model } from 'baqend';

import { TagService } from '../shared';
import { InstagramService, InstgramPost } from '../shared';

@Component({
    selector: 'blog-footer',
    templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit {
    tags: model.Tag[] = [];
    instagramPosts: InstgramPost[] = [];

    constructor(
      private tagService: TagService,
      private instagramService: InstagramService
    ) {}

    ngOnInit() {
      this.tagService.getAll()
          .then((tags: model.Tag[]) => this.tags = tags);

      this.instagramService.getRecent()
          .then((instagramPosts: InstgramPost[]) => this.instagramPosts = instagramPosts, (e) => console.log(e));
    }
}
