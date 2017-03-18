import { db, model } from 'baqend';

export class TagService {
    private tags: model.Tag[] = [];
    private loaded = false;

    getAll(): Promise<model.Tag[]> {
        if (this.loaded) {
            return Promise.resolve(this.tags);
        }

        return db.ready()
            .then(() => {
                return db.Tag.find()
                    .ascending('name')
                    .resultList()
                    .then((tags: model.Tag[]) => {
                        this.tags = tags;
                        this.loaded = true;

                        return tags;
                    });
            });
    }

    getForPost(post: model.Post): model.Tag[] {
        let tags: model.Tag[] = [];
        if (!post.tags) {
            post.tags = new Set();
        }

        this.tags.forEach((tag) => {
            if (post.tags.has(tag)) {
                tags.push(tag);
            }
        });

        return tags;
    }

    getByAlias(alias: string): Promise<model.Tag> {
        let task: Promise<model.Tag[]>[] = [];

        if (!this.loaded) {
            task.push(this.getAll());
        }

        return Promise.all(task)
            .then(() => this.tags.find((tag: model.Tag) => tag.alias === alias));
    }
}
