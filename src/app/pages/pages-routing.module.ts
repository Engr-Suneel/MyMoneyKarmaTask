import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoute } from '../helpers/app-route';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TypingTestComponent } from './typing-test/typing-test.component';

const routes: Routes = [
  { path: '', redirectTo: AppRoute.DASHBOARD },
  { path: AppRoute.DASHBOARD, component: DashboardComponent },
  { path: AppRoute.TYPING_TEST, component: TypingTestComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
