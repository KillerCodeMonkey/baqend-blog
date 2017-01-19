import { Component, OnInit } from '@angular/core';
import { model } from 'baqend';

import { TagService } from '../shared';

@Component({
    selector: 'blog-footer',
    templateUrl: './footer.component.html'
})

export class FooterComponent implements OnInit {
    tags: model.Tag[] = [];

    constructor(private tagService: TagService) {}

    ngOnInit() {
        console.log('test ============ ');
        this.tagService.getAll()
            .then((tags: model.Tag[]) => this.tags = tags);
    }
}
