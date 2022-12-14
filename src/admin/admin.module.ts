import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CouresExtraInfoComponent } from './coures-extra-info/coures-extra-info.component';
import { Routes, RouterModule } from '@angular/router';
import { DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import { RequestsComponent } from 'src/enrollment-request/requests/requests.component';
import { SharedModule } from 'src/shared/shared.module';
import { TraineePerformanceReportComponent } from './report/trainee-performance-report/trainee-performance-report.component';
import { TraineeListReportComponent } from './report/trainee-list-report/trainee-list-report.component';
import { FinancialReportComponent } from './report/financial-report/financial-report.component';
import { TotalTraineeReportsComponent } from './report/total-trainee-reports/total-trainee-reports.component';
import { CategoryComponent } from './category/category.component';

const routes: Routes = [
  {
    path: 'financial-reports',
    component: FinancialReportComponent,
  },
  {
    path: 'trainee-performance-reports',
    component: TraineePerformanceReportComponent,
  },
  {
    path: 'trainee-list-reports',
    component: TraineeListReportComponent,
  },
  {
    path: 'trainee-total-reports',
    component: TotalTraineeReportsComponent,
  },
  {
    path: 'course-extra-info',
    component: CouresExtraInfoComponent,
  },
  {
    path: 'course/category',
    component: CategoryComponent,
  },
  {
    path: 'enrollment-requests',
    component: RequestsComponent,
  },
];

@NgModule({
  declarations: [RequestsComponent, FinancialReportComponent, CouresExtraInfoComponent, TraineePerformanceReportComponent, TraineeListReportComponent, TotalTraineeReportsComponent, CategoryComponent],
    exports: [RouterModule],
    providers: [],
    imports: [
        SharedModule,
        CommonModule,
        DateRangePickerModule,
        RouterModule.forChild(routes),
        SharedModule
    ]
})
export class AdminModule { }
