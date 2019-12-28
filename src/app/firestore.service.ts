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
import {SubWikiContent} from './_models/sub-wiki-content';
import {ReemittingObserver} from './ReemittingObserver';
import {PageContent} from './_models/pageContent';
import {Page} from './_models/page';

@Injectable({
    providedIn: 'root'
})
export class FirestoreService {
    private readonly subwikiCollection: AngularFirestoreCollection<SubWiki>;
    private readonly contentCollection: AngularFirestoreCollection<SubWikiContent>;
    private subwikis: ReemittingObserver<SubWiki[]>;
    private pageCollection: AngularFirestoreCollection<PageContent>;


    constructor(private fireStore: AngularFirestore, private storage: AngularFireStorage) {
        this.subwikiCollection = this.fireStore.collection('subwiki');
        this.subwikis = new ReemittingObserver(this.subwikiCollection.snapshotChanges().pipe(this.mapCollection()));
        this.contentCollection = this.fireStore.collection('content');
        this.pageCollection = this.fireStore.collection('page');
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

    public getSubWikiByName(name: string): Promise<SubWiki> {
        return this.subwikiCollection.ref.where('name', '==', name).limit(1).get().then(this.mapGet()).then(mapped => {
            return mapped[0] as SubWiki;
        });
    }

    public getContentByName(name: string): Promise<SubWikiContent> {
        return this.getSubWikiByName(name).then(subwiki =>
            this.contentCollection.ref.doc(subwiki.contentRef).get().then(this.mapDocGet())
        );
    }

    public createSubWiki(subwiki: SubWiki): Promise<DocumentReference> {
        return this.createContent(subwiki.name).then(ref => {
            subwiki.contentRef = ref.id;
            return this.subwikiCollection.add(subwiki);
        });
    }

    private createContent(name: string) {
        return this.createPageContent(name).then(ref => {
            return this.contentCollection.add({pages: [{title: name, home: true, category: '', pageContentRef: ref.id}]});
        });
    }

    private createPageContent(name: string) {
        return this.pageCollection.add({paragraphs: [{title: name, nodes: [{type: 'text', value: 'Content...'}]}]});
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

    getPageContentByName(subwiki: string, pageName: string | null): Promise<PageContent> {
        return this.getContentByName(subwiki).then(content => {
            const page = this.getPage(content, pageName);
            return this.getPageContent(page.pageContentRef);
        });
    }

    private getPage(content: SubWikiContent, pageName: string | null): Page {
        let pageByName = [];
        if (pageName && pageName.trim() !== '') {
            pageByName = content.pages.filter(page => page.title === pageName);
        }
        return pageByName.length > 0 ? pageByName[0] : content.pages.filter(page => page.home)[0];
    }

    private getPageContent(pageContentRef: string): Promise<PageContent> {
        return this.pageCollection.ref.doc(pageContentRef).get().then(this.mapDocGet());
    }

    updatePageContent(page: PageContent) {
        const pageRef = this.pageCollection.doc(page.id);
        delete page.id;
        pageRef.set(page).catch(err => console.error(err));
    }
}
