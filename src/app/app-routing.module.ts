import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JsDocsComponent } from './component/js-docs/js-docs.component';

const routes: Routes = [
  { path: '', redirectTo: 'app-js-docs', pathMatch: 'full' },
  { path: 'app-js-docs', component: JsDocsComponent },
  { path: '**', component: JsDocsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
