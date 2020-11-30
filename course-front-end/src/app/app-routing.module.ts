import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SchedulesComponent } from './schedules/schedules.component';
import { CoursesStoreComponent } from './courses-store/courses-store.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ContentComponent } from './content/content.component';
import { UserManageComponent } from './user-manage/user-manage.component';
import { ScheduleCoursesComponent } from './schedule-courses/schedule-courses.component';

import { RouterGuardGuard } from './router-guard.guard';

const routes: Routes = [
  {
    path: '',
    component: ContentComponent,
    canActivate: [RouterGuardGuard],
    children: [
      { path: '', component: SchedulesComponent },
      { path: 'schedules/:type', component: SchedulesComponent },
      { path: 'courses', component: CoursesStoreComponent },
      { path: 'user-manage', component: UserManageComponent },
      { path: 'schedule-courses/:id', component: ScheduleCoursesComponent },
    ],
  },
  {
    path: 'register',
    canActivate: [RouterGuardGuard],
    component: RegisterComponent,
  },
  { path: 'login', canActivate: [RouterGuardGuard], component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
