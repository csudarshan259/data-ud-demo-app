import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UploadDataService } from '../services/upload-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as sha512 from 'js-sha512';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-upload-data',
  templateUrl: './upload-data.component.html',
  styleUrls: ['./upload-data.component.css']
})
export class UploadDataComponent implements OnInit {

  profileForm: FormGroup;
  message = '';
  profilePicture: File;
  resume: File;
  user: any = [];
  recentImage = false;
  recentResumeFile = false;
  allInputsDisabled = false;
  constructor(private formBuilder: FormBuilder, private uploadDataService: UploadDataService, private route: ActivatedRoute,
    private db: AngularFireDatabase, private router: Router, private cdr: ChangeDetectorRef) { }



  ngOnInit(): void {

    let email = this.route.snapshot.paramMap.get('email');
    console.log(email);
    if (email == null) {

    } else {
      const shaHash = sha512.sha512_256(email);
      this.db.list('user/' + shaHash).valueChanges().subscribe(result => {
        this.user = result;
        console.log(this.user);
        this.setData();

      });
    }



    this.profileForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      coverLetter: ['', []],
      profilePicture: ['', Validators.required],
      resume: ['', Validators.required],
    });




  }

  formSubmit() {
    this.disableAllInputs();
    this.cdr.detectChanges();

    if (!this.profilePictureValidation(this.profileForm.get('profilePicture').value)) {
      this.enableAllInputs();
      return;
    }

    this.uploadDataService.uploadDataToAfs(this.profileForm.value, this.profilePicture, this.resume).then(result => {
      console.log('result in main', result);
    });
    let count = 0;
    this.uploadDataService.eventCallback$.subscribe((data) => {
      if (data == 'true') {
        count = count + 1;
      }
      if (count == 2) {
        alert('Data Saved Successfully');
        count = 0;
        this.profileForm.reset();
        this.enableAllInputs();

      }

    });
  }




  profilePictureValidation(pic) {
    if (pic == null) {
      return;
    }
    const parts = pic.split('.');
    let extension = '';
    extension = parts[parts.length - 1];
    console.log(extension);
    extension = extension.toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'bmp':
      case 'png':

        return true;
    }

    this.message = 'Only jpg, bmp, png format are allowed.';
    alert(this.message);
    this.message = '';
    return false;
  }

  fileChange(event) {
    this.profilePicture = event.target.files[0];
  }
  fileChange1(event) {
    this.resume = event.target.files[0];
  }
  setData() {
    this.profileForm.get('firstName').setValue(this.user[2]);
    this.profileForm.get('lastName').setValue(this.user[3]);
    this.profileForm.get('email').setValue(this.user[1]);
    this.profileForm.get('coverLetter').setValue(this.user[0]);
    //  this.profileForm.get('profilePicture').setValue(this.user[3]);
    //   this.profileForm.get('resume').setValue(this.user[4]);
    this.recentImage = true;
    this.recentResumeFile = true;
  }

  resetForm() {
    this.profileForm.reset();
    this.router.navigateByUrl('upload-page');

  }
  disableAllInputs() {
    this.profileForm.controls['firstName'].disable();
    this.profileForm.controls['lastName'].disable();
    this.profileForm.controls['email'].disable();
    this.profileForm.controls['coverLetter'].disable();
    this.profileForm.controls['profilePicture'].disable();
    this.profileForm.controls['resume'].disable();

  }
  enableAllInputs() {
    this.profileForm.controls['firstName'].enable();
    this.profileForm.controls['lastName'].enable();
    this.profileForm.controls['email'].enable();
    this.profileForm.controls['coverLetter'].enable();
    this.profileForm.controls['profilePicture'].enable();
    this.profileForm.controls['resume'].enable();

  }
}
