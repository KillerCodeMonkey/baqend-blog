import { Injectable } from '@angular/core';
import { db, model } from 'baqend';

import { Converter } from 'showdown';

import { TagService } from './tag.service';

@Injectable()
export class PostService {
    tagID: string;

    converter = new Converter();

    constructor(
        private tagService: TagService
    ) {}

    getAll(tag?: string): Promise<model.Post[]> {
        let req = db.Post.find();

        if(tag) {
            this.tagID = this.tagService.getIDbyTagName(tag);

            return req
            .in('tags', this.tagID)
            .descending("date")
            .limit(30)
            .resultList()
            .then((posts: model.Post[]) => {
                posts.forEach((post) => {
                    post.text = this.converter.makeHtml(post.text);
                });

                return posts;
            });
        } else {
            return req
            .descending("date")
            .limit(30)
            .resultList()
            .then((posts: model.Post[]) => {
                posts.forEach((post) => {
                    post.text = this.converter.makeHtml(post.text);
                });

                return posts;
            });
        }
    }

    get(slug: string): Promise<model.Post|never> {

        return db.Post.find()
            .equal('slug', slug)
            .singleResult()
            .then((post: model.Post) => {
                if (!post) {
                    throw new Error('not_found');
                }
//                 post.text = `![enter image description here](https://blog-bq.global.ssl.fastly.net/v1/file/www/images/posts/instragram3.jpg?BCB)

// **Beispielhafter Blogbeitrag mit Einleitungstext über mehrere Zeilen. Leider fällt mir kein Inhalt ein, weshalb ich sinnlos Wörter aneinander reihe. Immer weiter - bis ausreichend Buchstaben und Wörten vorhanden sind, um als Einleitung durchzugehen. Ist das jetzt schon ausreichend?**


// ----------


// Und hier beginnt der eigentliche Blogbeitrag mit vielen informativen Dingen. Ja, du liest richtig lieber Leser - es geht um Dinge!

// So ein Text eignet sich auch besonders gut für Listen, also lasst es uns testen:

//  - Listenpunkt 1: Da ist er schon und zeigt sich in voller Pracht. Listen sind etwas ausgesprochen Tolles! Wir brauchen mehr davon
//  - Listenpunkt 2: Der zweite Punkt dieser Liste, mit nicht ganz so spektakulärem Inhalt.
//  - Listenpunkt 3: Und zum Abschluss noch ein dritter Punkt mit mäßigen Inhalt. Somit endet die Liste hier!

// Und weiter geht es im normalen Fließtext. Langsam plätschert er vor sich hin und interessiert doch eigentlich keinen. Schade eigentlich! Aber wir müssen weiter schreiben, um alle möglichen Formatierungen eines Blogbeitrags aufzuzeigen. Und da fehlt natürlich noch eine [Verlinkung](www.google.de), die uns in die Untiefen des WWW führt. Folge ihr und lüfte das Geheimnis.

// Zum Abschluss noch ein kurzer Absatz, der die ganze Geschichte abrundet. Das muss doch reichen, oder nicht?!`

//                 post.update();

                post.text = this.converter.makeHtml(post.text);

                return post;
            });
    }
}
