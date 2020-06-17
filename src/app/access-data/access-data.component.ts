import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import * as sha512 from 'js-sha512';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-access-data',
  templateUrl: './access-data.component.html',
  styleUrls: ['./access-data.component.css']
})

export class AccessDataComponent implements OnInit {
  users: any;
  data1: any;
  resumeUrl: Observable<string | null>;
  profilePictureUrl: Observable<string | null>;
  constructor(private db: AngularFireDatabase, private storage: AngularFireStorage) {


  }

  ngOnInit(): void {
    this.db.list('user').valueChanges().subscribe(result => {
      this.users = result;
      this.getLinks(result);

    });

  }

  getLinks(data) {
    this.data1 = data;
    for (let i = 0; i < data.length; i++) {
      const shaHash = sha512.sha512_256(data[i].email);

      const profilePictureName = data[i].profilePicture;
      //console.log(profilePictureName);
      const localpath = 'images/' + shaHash + '-' + profilePictureName;
      const ref = this.storage.ref(localpath);
      console.log(ref.getDownloadURL());
      //this.users[i].profilePicture= 
      ref.getDownloadURL().subscribe(url => this.users[i].profilePicture = url);

      const resumeName = data[i].resume;
      const localpath1 = shaHash + '-' + resumeName;
      // localpath1 = localpath1.split(' ').join('_');
      console.log(localpath1);
      const ref1 = this.storage.ref(localpath1);
      console.log(ref.getDownloadURL());

      ref1.getDownloadURL().subscribe(url1 => {
        this.users[i].resume = url1;
      });



    }
  }
  async confirmDelete(email, profilePicture, resume) {
    let shaHash = sha512.sha512_256(email);
    const isDelete = confirm('Are you sure want to delete it?');

    if (isDelete) {
      let count = 0;
      const promise = this.db.object('user/' + shaHash).remove();
      promise.then(async _ => {
        await this.storage.storage.refFromURL(profilePicture).delete().then(_ => count = count + 1);

        await this.storage.storage.refFromURL(resume).delete().then(_ => {
          count = count + 1;
        });
        if (count == 2) {
          alert('Deletion process completed');

          count = 0;
        }
      });


    }
    return;
  }
}
