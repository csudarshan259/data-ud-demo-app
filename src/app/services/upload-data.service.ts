import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import * as sha512 from 'js-sha512';
import { AngularFireStorage } from '@angular/fire/storage';


@Injectable({
  providedIn: 'root'
})
export class UploadDataService {

  constructor(private angularFireDB: AngularFireDatabase, private storage: AngularFireStorage) { }

  uploadDataToAfs(value, profilePicture, resume) {
    const shahash = sha512.sha512_256(value.email);
    const userRef = this.angularFireDB.object('user/' + shahash);
    userRef.update(value).then((result) => {
      console.log('saved');
      const success = this.updloadFileToFireBase(profilePicture, resume, shahash, value.email);
      console.log('success', success);
      return success;

    });

  }
  updloadFileToFireBase(profilePicture, resume, path, email) {
    // upload profile picture

    try {


      let profilePictureName = profilePicture.name;
      //console.log(profilePictureName);
      let localpath = 'images/' + path + '-' + profilePictureName;
     // localpath = localpath.split(' ').join('_');
      console.log(localpath);

      const ref = this.storage.ref(localpath);
      //console.log(profilePicture);
        const task = ref.put(profilePicture);
      //const task = this.storage.upload(localpath, profilePicture);
      //const task = this.storage.upload(profilePictureName, profilePicture);
      // task.then(pro => console.log('pro',pro)).catch((err) => { console.log('profile picture error', err); return false; });
      //console.log(task);

      task.then(result => console.log(result));
      task.catch(err => {
        console.log('error', err);
      });



      // upload resume
      let resumeName = resume.name;
      let localpath1 = path + '-' + resumeName;
     // localpath1 = localpath1.split(' ').join('_');
      console.log(localpath1);
      const ref1 = this.storage.ref(localpath1);
      const task1 = ref1.put(resume);
      task1.catch(error => {
        console.log('resume error', error);
        return false;
      });

    } catch (error) {
      console.log('err',error);
      return false;
    }
    return true;
  }

}
