import { async, TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { db } from 'baqend';

import { DBReady, DBService } from './db.service';


describe('DB', () => {

  describe('DBReady', () => {
    it('return db ready state', () => {
      const resolver = new DBReady();

      spyOn(db, 'ready').and.returnValue(true);

      expect(resolver.resolve({} as ActivatedRouteSnapshot)).toBeTruthy();
      expect(db.ready).toHaveBeenCalled();
    });
  });
  describe('DBService', () => {
    it('connect to baqend', () => {
      spyOn(db, 'connect');

      const resolver = new DBService();

      expect(db.connect).toHaveBeenCalledWith('blog', true);
    });
  });
});
