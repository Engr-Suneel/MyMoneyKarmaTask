import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TypingTestComponent } from './typing-test/typing-test.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TimerPipe } from '../core/pipes/timer.pipe';


@NgModule({
  declarations: [
    DashboardComponent,
    TypingTestComponent,
    TimerPipe
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    TimerPipe
  ]
})
export class PagesModule { }
