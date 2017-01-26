import { db, model } from 'baqend';

export class TagService {

    getAll(): Promise<model.Tag[]> {
        return db.ready()
            .then(() => {
                return db.Tag.find()
                    .ascending("name")
                    .resultList();
            });
    }
}
