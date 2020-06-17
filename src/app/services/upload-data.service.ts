import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import * as sha512 from 'js-sha512';
import { AngularFireStorage } from '@angular/fire/storage';
import { async } from '@angular/core/testing';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UploadDataService {
  private eventCallback = new Subject<string>();
  eventCallback$ = this.eventCallback.asObservable();

  imageupload = false;
  fileupload = false;

  constructor(private angularFireDB: AngularFireDatabase, private storage: AngularFireStorage) { }

  uploadDataToAfs(value, profilePicture, resume) {
    value.profilePicture = profilePicture.name;
    value.resume = resume.name;

    const shaHash = sha512.sha512_256(value.email);
    const userRef = this.angularFireDB.object('user/' + shaHash);

    return userRef.update(value).then((result) => {
      console.log('saved');
      const success = this.updloadFileToFireBase(profilePicture, resume, shaHash);
      console.log('success', success);
      return success;

    });

  }

  updloadFileToFireBase(profilePicture, resume, path) {
    // upload profile picture

    try {


      const profilePictureName = profilePicture.name;
      // console.log(profilePictureName);
      const localpath = 'images/' + path + '-' + profilePictureName;
      //  console.log(localpath);
      const ref = this.storage.ref(localpath);
      // console.log(profilePicture);
      const task = ref.put(profilePicture);
      task.then(result => {
        console.log(result);
        this.imageupload = true;
        this.eventCallback.next(this.imageupload + '');
      });
      task.catch(err => {
        console.log('Image error', err);
      });



      // upload resume
      const resumeName = resume.name;
      const localpath1 = path + '-' + resumeName;
      // localpath1 = localpath1.split(' ').join('_');
      // console.log(localpath1);
      const ref1 = this.storage.ref(localpath1);
      const task1 = ref1.put(resume);
      task1.then(result => {
        console.log(result);
        this.fileupload = true;
        this.eventCallback.next(this.fileupload + '');
      });
      task1.catch(error => {
        console.log('resume error', error);
        return false;
      });

      // return true;

    } catch (error) {
      console.log('parent error', error);
      return false;
    }
    return true;
  }

}
