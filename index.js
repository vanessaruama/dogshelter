const admin = require('firebase-admin');
const serviceAccount = require('./dog-shelter-a8e65-firebase-adminsdk-3gfu8-c698b4c8fe.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Agora você pode usar o SDK Admin para acessar os serviços do Firebase
