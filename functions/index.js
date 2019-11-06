const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });
admin.initializeApp(functions.config().firebase);

const { auth, firestore } = admin;

exports.deleteUserFromAuthentications = functions.https.onRequest((request, res) => {
  const { userId, collectionName } = request.query;
  auth().deleteUser(userId)
    .then(() => {
      deleteUserFromDB(collectionName, userId, res);
      return;
    })
    .catch((error) => {
      console.log(error, " error in delete user from authentication");
      throw new Error('AUTH_DELETE_FAILED');
    });
});

const deleteUserFromDB = (collectionName, docId, res) => {
  firestore().collection(collectionName).doc(docId).delete()
    .then(() => res.send("SUCCESS"))
    .catch((error) => {
      console.log(error, " error in delete user from firestore");
      throw new Error('FIRESTORE_DELETE_FAILED');
    });
}

exports.changePasswordFromAuthentications = functions.https.onRequest((request, res) => {
  const { userId, newPassword } = request.query;
  auth().updateUser(userId, {
    password: newPassword,
  })
    .then(() => updatePassword(userId, newPassword, res))
    .catch((error) => {
      console.log(error, " error in delete user from authentication");
      throw new Error('AUTH_UPDATE_PASSWORD_FAILED');
    });
});

const updatePassword = (docId, password, res) => {
  firestore().collection("users").doc(docId).update({
    password,
  }).then(() => res.send("SUCCESS")).catch((error) => {
    console.log(error, " error in update user password from firestore");
    throw new Error('FIRESTORE_UPDATE_PASSWORD_FAILED');
  });
}
