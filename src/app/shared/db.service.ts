import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { db, baqend } from 'baqend';

export class DBReady implements Resolve<baqend> {

  constructor() {}

  resolve(route: ActivatedRouteSnapshot): Promise<baqend> {
    return db.ready();
  }
}

export class DBService {
    constructor() {
        db.connect('blog', true);
    }
}

export const DB_PROVIDERS = [DBReady, DBService];
