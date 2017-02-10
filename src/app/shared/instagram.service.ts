import { Injectable } from '@angular/core';
import { Jsonp, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

export interface InstagramImage {
    width: number;
    height: number;
    url: string;
}

export interface InstagramUser {
    profile_picture: string
    full_name?: string;
    username: string;
    id: string;
}

export interface InstgramPost {
    tags: string[];
    caption: {
        text: string;
        created_time: string;
        from: InstagramUser;
    };
    type: string;
    link: string;
    created_time: string;
    likes: {
        count: number;
    };
    id: string;
    images: {
        thumbnail: InstagramImage;
        low_resolution: InstagramImage;
        standard_resolution: InstagramImage;
    };
    user: InstagramUser
}

@Injectable()
export class InstagramService {
    private API_URL = 'https://api.instagram.com/v1/users';
    private ACCESS_TOKEN: string = '1397597419.1677ed0.189a5cd3fde14129a861c6ec5cccf340';

    constructor(
        private http: Jsonp
    ) {}

    getRecent(user: String = 'self'): Promise<InstgramPost[]> {
        const url = this.buildURL(user + '/media/recent');

        return this.http.get(url)
            .map((response: Response) => response.json().data)
            .toPromise();
    }

    private buildURL(uri: string): string {
        return this.API_URL + '/' + uri + '/?access_token=' + this.ACCESS_TOKEN + '&callback=JSONP_CALLBACK'
    }
}
