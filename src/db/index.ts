import * as admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.cert(require('../config/firebase.json')),
});
