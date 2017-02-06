import { db, model } from 'baqend';

export class TagService {
    private tags: model.Tag[];

    getAll(): Promise<model.Tag[]> {
        return db.ready()
            .then(() => {
                return db.Tag.find()
                    .ascending("name")
                    .resultList()
                    .then( (tags: model.Tag[]) => {
                        this.tags = tags;

                        return tags;
                    });
            });
    }

    getIDbyTagName(tagName: string) {
        for (let tag of this.tags) {
            if (tag.alias === tagName) {
                return tag.id;
            }
        }
    }
}
