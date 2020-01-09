import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.firebaseConfig());
const db = admin.firestore();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const search = functions.region('europe-west2').https.onCall((data, context) => {
    const result = [];
    data.query = data.query.toLowerCase();
    return db.collection('subwiki').where('name', '==', data.subwiki).get().then(subwiki => {
        const contentRef = subwiki.docs[0].data().contentRef;
        return db.doc('content/' + contentRef).get().then(async content => {
            for(const pageContent of content.data().pages) {
                if (pageContent.title.toLocaleLowerCase().includes(data.query)) {
                    result.push(pageContent.title);
                } else {
                   const page =  await db.doc('page/' + pageContent.pageContentRef).get();
                   if(JSON.stringify(page.data()).toLowerCase().includes(data.query)) {
                       result.push(pageContent.title);
                       // TODO do not find query in variable name
                   }
                }
            }
            return result;
        });
    });
});
