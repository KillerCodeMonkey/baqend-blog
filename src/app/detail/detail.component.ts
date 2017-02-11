import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { db, model } from 'baqend';

import { CommentData, CommentService, PostService } from '../shared';

@Component({
    templateUrl: './detail.component.html'
})

export class DetailComponent implements OnInit {
    post: model.Post;
    notFound: boolean = false;
    commentSaved = false;
    private operators = ['+', '-', '*']
    captcha: {
        task: string;
        solution: number;
    };

    form: FormGroup;

    constructor(
        private commentService: CommentService,
        private postService: PostService,
        private route: ActivatedRoute,
        private location: Location,
        private sanitizer: DomSanitizer,
        private fb: FormBuilder
    ) {
        this.form = this.fb.group({
            text: ['', Validators.compose([Validators.required, Validators.minLength(10)])],
            name: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
            email: [''],
            website: ['', Validators.pattern(/^$/)],
            answer: ['', Validators.required]
        });

        this.captcha = this.generateCaptcha();
    }

    private generateCaptcha() {
        const number1 = this.randomNumber();
        const number2 = this.randomNumber();
        const operator = this.operators[this.randomNumber(0, this.operators.length - 1)];
        const task = number1 + ' ' + operator + ' ' + number2;

        return {
            task: task,
            solution: eval(task)
        }
    }

    private randomNumber(min: number = 0, max: number = 10) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


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

    createComment(data: CommentData) {
        this.form.reset();
        this.captcha = this.generateCaptcha();

        this.commentService.create(data).then(comment => {
            this.commentSaved = true;
            this.postService.addComment(this.post, comment);
        });
    }

    back() {
        this.location.back();
    }
}
