import {Injectable} from '@angular/core';
import {AngularFirestore, DocumentReference, DocumentSnapshot, QueryDocumentSnapshot} from '@angular/fire/firestore';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage';
import {SubWiki} from './_models/sub-wiki';
import {flatMap, map, take} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {UploadTask} from '@angular/fire/storage/interfaces';
import {SubWikiContent} from './_models/sub-wiki-content';

@Injectable({
    providedIn: 'root'
})
export class FirestoreService {
    private readonly subwikiCollection = 'subwiki';
    private readonly contentCollection = 'content';


    constructor(private fireStore: AngularFirestore, private storage: AngularFireStorage) {
    }

    public resolveStorageRev(ref: string) {
        return this.storage.ref(ref).getDownloadURL();
    }

    public getSubWikis(): Observable<QueryDocumentSnapshot<SubWiki>[]> {
        return this.fireStore.collection(this.subwikiCollection).snapshotChanges()
            .pipe(map(this.mapFromCollection())) as Observable<QueryDocumentSnapshot<SubWiki>[]>;
    }

    public getSubWiki(id: string): Observable<DocumentSnapshot<SubWiki>> {
        return this.fireStore.collection(this.subwikiCollection).doc(id).snapshotChanges()
            .pipe(map(this.mapFromDoc())) as Observable<DocumentSnapshot<SubWiki>>;
    }

    public createSubWiki(subwiki: SubWiki): Promise<DocumentReference> {
        return this.fireStore.collection(this.subwikiCollection).add(subwiki);
    }

    public getContent(id: string): Observable<DocumentSnapshot<SubWikiContent>> {
        return this.fireStore.collection(this.contentCollection).doc(id).snapshotChanges()
            .pipe(map(this.mapFromDoc())) as Observable<DocumentSnapshot<SubWikiContent>>;
    }

    private mapFromCollection() {
        return value => value.map(val => val.payload.doc);
    }

    private mapFromDoc() {
        return value => value.payload;
    }
}
