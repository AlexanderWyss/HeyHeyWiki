import {Injectable} from '@angular/core';
import {
    Action,
    AngularFirestore,
    AngularFirestoreCollection, DocumentChangeAction,
    DocumentReference,
    DocumentSnapshot
} from '@angular/fire/firestore';
import {AngularFireStorage} from '@angular/fire/storage';
import {SubWiki} from './_models/sub-wiki';
import {map} from 'rxjs/operators';
import {Observable, OperatorFunction} from 'rxjs';
import {SubWikiContent} from './_models/sub-wiki-content';
import {ReemittingObserver} from './ReemittingObserver';

@Injectable({
    providedIn: 'root'
})
export class FirestoreService {
    private readonly subwikiCollection: AngularFirestoreCollection<SubWiki>;
    private readonly contentCollection: AngularFirestoreCollection<SubWikiContent>;
    private subwikis: ReemittingObserver<SubWiki[]>;


    constructor(private fireStore: AngularFirestore, private storage: AngularFireStorage) {
        this.subwikiCollection = this.fireStore.collection('subwiki');
        this.subwikis = new ReemittingObserver(this.subwikiCollection.snapshotChanges().pipe(this.mapCollection()));
        this.contentCollection = this.fireStore.collection('content');
    }

    public resolveStorageRev(ref: string) {
        return this.storage.ref(ref).getDownloadURL();
    }

    public getSubWikis(): ReemittingObserver<SubWiki[]> {
        return this.subwikis;
    }

    public getSubWiki(id: string): Observable<SubWiki> {
        return this.subwikiCollection.doc(id).snapshotChanges().pipe(this.mapDoc());
    }

    public createSubWiki(subwiki: SubWiki): Promise<DocumentReference> {
        return this.subwikiCollection.add(subwiki);
    }

    public getContent(id: string): Observable<DocumentSnapshot<SubWikiContent>> {
        return this.contentCollection.doc(id).snapshotChanges().pipe(this.mapDoc());
    }

    private mapCollection<T extends DocumentChangeAction<any>, R>(): OperatorFunction<T[], R[]> {
        return map(list => list.map(value => {
            const doc = value.payload.doc;
            const id = doc.id;
            const data = doc.data();
            return {id, ...data} as unknown as R;
        }));
    }

    private mapDoc<T extends Action<any>, R>(): OperatorFunction<T, R> {
        return map(value => {
            const doc = value.payload;
            const id = doc.id;
            const data = doc.data();
            return {id, ...data} as unknown as R;
        });
    }
}
