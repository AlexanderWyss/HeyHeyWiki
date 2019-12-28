import { Pipe, PipeTransform } from '@angular/core';
import {FirestoreService} from '../firestore.service';
import {Observable} from 'rxjs';

@Pipe({
  name: 'resolveStorage'
})
export class ResolveStoragePipe implements PipeTransform {

  constructor(private firestore: FirestoreService) {
  }

  transform(value: any, folder: string): Observable<any> {
    return this.firestore.resolveStorageRev(folder, value);
  }

}
