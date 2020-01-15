import {Injectable} from '@angular/core';
import {
    Action,
    AngularFirestore,
    AngularFirestoreCollection, DocumentChangeAction,
    DocumentReference,
    DocumentSnapshot, QuerySnapshot
} from '@angular/fire/firestore';
import {AngularFireStorage} from '@angular/fire/storage';
import {SubWiki} from './_models/sub-wiki';
import {map} from 'rxjs/operators';
import {Observable, OperatorFunction} from 'rxjs';
import {ReemittingObserver} from './ReemittingObserver';
import {PageInfo} from './_models/pageInfo';
import {v4 as uuid} from 'uuid';
import {Page} from './_models/page';
import {Unsubscribe} from 'firebase';

@Injectable({
    providedIn: 'root'
})
export class FirestoreService {
    private readonly subwikiCollection: AngularFirestoreCollection<SubWiki>;
    private subwikis: ReemittingObserver<SubWiki[]>;
    private readonly pageInfoCollection: AngularFirestoreCollection<PageInfo>;
    private pageCollection: AngularFirestoreCollection<Page>;


    constructor(private fireStore: AngularFirestore, private storage: AngularFireStorage) {
        this.subwikiCollection = this.fireStore.collection('subwiki');
        this.subwikis = new ReemittingObserver(this.subwikiCollection.snapshotChanges().pipe(this.mapCollection()));
        this.pageInfoCollection = this.fireStore.collection('pageinfo');
        this.pageCollection = this.fireStore.collection('page');
    }

    public resolveStorageRev(folder: string, ref: string): Observable<any> {
        return this.storage.ref(folder).child(ref).getDownloadURL();
    }

    uploadFile(folder: string, file: any) {
        return this.storage.ref(folder + '/' + uuid()).put(file);
    }

    public getSubWiki(id: string): Observable<SubWiki> {
        return this.subwikiCollection.doc(id).snapshotChanges().pipe(this.mapDoc());
    }

    public getSubWikis(): ReemittingObserver<SubWiki[]> {
        return this.subwikis;
    }

    public getSubWikiByName(name: string): Promise<SubWiki> {
        return this.subwikiCollection.ref.where('name', '==', name).limit(1).get().then(this.mapGet()).then(mapped => {
            return mapped[0] as SubWiki;
        });
    }

    public createSubWiki(subwiki: SubWiki) {
        return this.subwikiCollection.add(subwiki).then(ref => {
            return this.createPageInternal(subwiki.name, '', true, ref.id).then(() => ref);
        });
    }

    public getPageInfo(id: string): Promise<PageInfo> {
        return this.pageInfoCollection.ref.doc(id).get().then(this.mapDocGet());
    }

    public getPageInfoByName(subwikiName: string, pageName: string): Promise<PageInfo> {
        return this.getSubWikiByName(subwikiName).then(subwiki =>
            this.pageInfoCollection.ref
                .where('subwikiRef', '==', subwiki.id)
                .where('title', '==', pageName)
                .limit(1).get().then(this.mapGet()).then(mapped => {
                return mapped[0] as PageInfo;
            })
        );
    }

    getPageInfosOfSubwikiById(id: string): Promise<PageInfo[]> {
        return this.pageInfoCollection.ref.where('subwikiRef', '==', id).get().then(this.mapGet());
    }

    listenPageInfosOfSubwikiByName(subwikiName: string, callbackfn: (value: PageInfo[]) => void): Promise<Unsubscribe> {
        return this.getSubWikiByName(subwikiName).then(subwiki => this.pageInfoCollection.ref
            .where('subwikiRef', '==', subwiki.id)
            .onSnapshot(snapshot => callbackfn(snapshot.docs.map(this.mapDocGet()))));
    }

    getHomePageInfo(subwikiName: string) {
        return this.getSubWikiByName(subwikiName).then(subwiki =>
            this.pageInfoCollection.ref
                .where('subwikiRef', '==', subwiki.id)
                .where('home', '==', true)
                .limit(1).get().then(this.mapGet()).then(mapped => {
                return mapped[0] as PageInfo;
            })
        );
    }

    getPage(pageRef: string): Promise<Page> {
        return this.pageCollection.ref.doc(pageRef).get().then(this.mapDocGet());
    }

    private createPageInternal(title: string, category: string, home: boolean, subwikiRef: string): Promise<DocumentReference> {
        return this.pageCollection.add({paragraphs: [{title, nodes: [{type: 'text', value: 'Content...'}]}]})
            .then(pageRef => this.pageInfoCollection.add({title, home, category, pageRef: pageRef.id, subwikiRef}));
    }

    public createPage(title: string, category: string, subwikiRef: string) {
        return this.createPageInternal(title, category, false, subwikiRef);
    }

    updatePage(page: Page) {
        const clone = {...page};
        const pageRef = this.pageCollection.doc(clone.id);
        delete clone.id;
        pageRef.set(clone).catch(err => console.error(err));
    }

    deletePage(pageInfo: PageInfo) {
        this.pageInfoCollection.doc(pageInfo.id).delete();
        this.pageCollection.doc(pageInfo.pageRef).delete();
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

    private mapGet<T, R>(): ((value: QuerySnapshot<T>) => R[]) {
        return list => {
            return list.docs.map(doc => {
                const id = doc.id;
                const data = doc.data();
                return {id, ...data} as unknown as R;
            });
        };
    }

    private mapDocGet<T, R>(): ((value: DocumentSnapshot<T>) => R) {
        return doc => {
            const id = doc.id;
            const data = doc.data();
            return {id, ...data} as unknown as R;
        };
    }

    fromRef(ref: DocumentReference): Promise<any> {
        return ref.get().then(this.mapDocGet());
    }
}
