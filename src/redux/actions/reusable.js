import { app } from '../../firebase';

export const generatePromiseArray = (collection, uid, type, subclass) => {
  const storageRef = app.storage().ref();
  return Object.keys(collection).map((key, index) => {
    return new Promise((resolve, reject) => {
      const ref = `${Date.now()}${index}`;
      const currentUpload = collection[key];
      const uploadRef = storageRef.child(`${uid}/${subclass}/${type}/${ref}`);
      uploadRef
        .put(currentUpload)
        .then(snapshot => {
          snapshot.ref
            .getDownloadURL()
            .then(url => {
              resolve({
                downloadUrl: url,
                fileName: currentUpload.name,
                storageRef: `${uid}/${subclass}/${type}/${ref}`
              });
            })
            .catch(err => reject(err));
        })
        .catch(err => reject(err));
    });
  });
};
