import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/service/api.service';

import moment from 'moment-es6';

@Component({
  selector: 'app-trainee-list-report',
  templateUrl: './trainee-list-report.component.html',
  styleUrls: ['./trainee-list-report.component.css']
})
export class TraineeListReportComponent implements OnInit {
  public columes:any[] = [];
  public data: any;
  public isFiltering: boolean = false;
  public fields: any = { text: 'name',value: 'id' };
  public fieldsQuiz: any = { text: 'title',value: 'id' };

  public formGroup: FormGroup;
  public formSubmitted = false;
  public disable: boolean = false;

  public quizzes:any[] = [];

  public moduleName: any = null;
  public courseTitle: any = null;
  public courses: any[] = [];

  constructor(
    public service: ApiService,
    private router: Router,
    public toastr: ToastrService
  ) { 
    this.formGroup = new FormGroup({
      courseId: new FormControl(null, Validators.required),
      quizId: new FormControl(null, Validators.required),

      dateRange: new FormControl(null)
    })
  }

  public getControls(name: any): FormControl {
    return this.formGroup.get(name) as FormControl;
  }

  ngOnInit(): void {
    this.columes = [ 
      {
        field: 'traineeName', headerText: 'Trainee Full name', width: '120'
      },
      {
        field: 'traineeSex', headerText: 'Sex', width: '40'
      },    
      {
        field: 'institution', headerText: 'Institution', width: '40'
      },
      {
        field: 'moduleName', headerText: 'Module', width: '90'
      },  
      {
        field: 'score', headerText: 'Result', width: '40'
      },
    ];

    this.loadCourses();
    
  }

  loadCourses(){
    this.service
    .mainCanvas(`getAllCourses`, 'get', null)
    .subscribe((response: any) => {
      this.courses = response;
    });
  }

  loadQuizzes(event: any){
    this.quizzes = [];
    this.getControls('quizId').disable();
    this.courseTitle = event.itemData.name;

    this.service
    .mainCanvas(`getAllModules/${event.value}`, 'get', {})
    .subscribe((response: any) => {
      if (response.status) {
        let modules  = response.message;

        modules.forEach((element: any) => {
          element.items.forEach((item:any) => {
            if(item.type == 'Quiz'){  
              this.quizzes.push({
                moduleName: element.name,
                title: item.title,
                id: item.content_id
              });  
            }
          });
        });

      } else {
        this.toastr.error(response.message, 'Error');

      }

      this.disable = false;
      this.getControls('quizId').enable();

    });
  }

  setModuleName(event:any){
    if(this.quizzes.length){
      this.moduleName = event.itemData.moduleName;
    }
  }

  DateDiff(startDate: any,endDate: any){
    let diff = (endDate - startDate) / (1000 * 60 * 60 * 24);

    return diff;
  }


  filterDate(){
    this.formSubmitted = true;

    if (!this.formGroup.valid) {
      return;

    } else {
      
      let payload = this.formGroup.value;

      payload.moduleName = this.moduleName;

      this.disable = true;
      this.isFiltering = true;

      this.service
        .mainCanvas(`getAllTraineeListReports`, 'post', payload)
        .subscribe((response: any) => {
          if (response.status) {

            let users = response.message[0].users;
            let submissions = response.message[0].quiz_submissions;


            let data: any[] = [];            

              if(payload.dateRange) {

                payload.dateRange[0]  = new Date(payload.dateRange[0]); 
                payload.dateRange[1]  = new Date(payload.dateRange[1]);

                let result = submissions.filter((ele: any) => {
  
                  let finished_at = new Date(ele.finished_at);
                  
                  // if(moment(payload.dateRange[0]).isSame(payload.dateRange[1])){
                    
                  if(moment(payload.dateRange[0]).isSame(finished_at, 'day')){
                    return ele;

                  } else {
                    if(moment(finished_at).isBetween(payload.dateRange[0],payload.dateRange[1])){
                      return ele;
                    } 

                  }
                   
                

                });

                submissions = result;

              }

            users.forEach((element: any) => {

              let result = submissions.find((ele: any) => {
                return ele.user_id == element.id;
              })

              if(result){

                data.push(
                  {
                    courseTitle: this.courseTitle,
                    traineeName: element.sortable_name,
                    traineeSex: element.pronouns ?? ' -- Not Specified by Trainee -- ',
                    moduleName: this.moduleName,
                    score: result.score,
                    date: result.finished_at,
                    institution: element.sis_user_id ?? '-- not Specified --'
                    
                  }
                )
              }
            });

            this.data = data;

            this.disable = false;
            this.isFiltering = false;

          } else {
            this.toastr.error(response.message, 'Error');
            this.disable = false;
            this.isFiltering = false;
  
          }
                  
        });
    }

  }

}