import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UploadDataComponent } from './upload-data/upload-data.component';
import { AccessDataComponent } from './access-data/access-data.component';


const routes: Routes = [
  { path: 'upload-page', component: UploadDataComponent },
  { path: 'data-access-page', component: AccessDataComponent },
  { path: '', redirectTo: '/upload-page', pathMatch: 'full' },
  { path: 'upload-page/:email', component: UploadDataComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
