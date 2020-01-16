import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.firebaseConfig());
const db = admin.firestore();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const search = functions.region('europe-west2').https.onCall((data, context) => {
    console.log(data);
    const result = [];
    data.query = data.query.toLowerCase();
    return db.collection('subwiki').where('name', '==', data.subwiki).get().then(subwiki => {
        return db.collection('pageinfo').where('subwikiRef', '==', subwiki.docs[0].ref.id).get().then(async pageInfos => {
            for (const pageQuerySnapshot of pageInfos.docs) {
                const pageInfo = pageQuerySnapshot.data();
                if (pageInfo.title.toLocaleLowerCase().includes(data.query)) {
                    result.push(pageInfo.title);
                } else {
                   const page =  await db.doc('page/' + pageInfo.pageRef).get();
                   if(JSON.stringify(page.data()).toLowerCase().includes(data.query)) {
                       result.push(pageInfo.title);
                   }
                }
            }
            return result;
        });
    });
});
