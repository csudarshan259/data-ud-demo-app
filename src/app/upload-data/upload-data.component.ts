import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UploadDataService } from '../services/upload-data.service';
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
  constructor(private formBuilder: FormBuilder, private uploadDataService: UploadDataService) { }

  ngOnInit(): void {
    this.profileForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      profilePicture: ['', Validators.required],
      resume: ['', Validators.required],
    });
  }

  formSubmit() {
    if (!this.profilePictureValidation(this.profileForm.get('profilePicture').value)) {
      return;
    }

    this.uploadDataService.uploadDataToAfs(this.profileForm.value, this.profilePicture, this.resume);

  }
  profilePictureValidation(pic) {
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

}
