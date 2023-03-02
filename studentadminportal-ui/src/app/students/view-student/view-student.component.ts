import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Gender } from 'src/app/models/ui-models/gender.model';
import { Student } from 'src/app/models/ui-models/student.model';
import { GenderService } from 'src/app/services/gender.service';
import { StudentService } from '../student.service';

@Component({
  selector: 'app-view-student',
  templateUrl: './view-student.component.html',
  styleUrls: ['./view-student.component.css'],
})
export class ViewStudentComponent implements OnInit {
  studentId: string | null | undefined;
  student: Student = {
    id: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    mobile: 0,
    genderId: '',
    profileImageUrl: '',
    gender: {
      id: '',
      description: '',
    },
    address: {
      id: '',
      physicalAddress: '',
      postalAddress: '',
    },
  };

  studentPage = 'students';

  isNewStudent = true;
  header = '';

  genderList: Gender[] = [];
  waitDuration = 2000;

  constructor(
    private readonly studentService: StudentService,
    private readonly route: ActivatedRoute,
    private readonly genderServive: GenderService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.studentId = params.get('id');

      if (this.studentId) {
        if (this.studentId.toLowerCase() === 'add') {
          this.isNewStudent = true;
          this.header = 'Add New Student';
        } else {
          this.isNewStudent = false;
          this.header = 'Edit Student';

          this.studentService
            .getStudent(this.studentId)
            .subscribe((successResponse) => {
              this.student = successResponse;
            });
        }

        this.genderServive.getGenderList().subscribe((successResponse) => {
          this.genderList = successResponse;
        });
      }
    });
  }

  OnUpdate(): void {
    this.studentService.updateStudent(this.student.id, this.student).subscribe(
      (successResponse) => {
        this.showMsgAndMoveToAnotherPage(
          'Student updated successfully',
          this.studentPage
        );
      },
      (errorResponse) => {
        this.showMsgAndMoveToAnotherPage(
          'Error - failed to update the Student!',
          this.studentPage
        );
      }
    );
  }

  OnDelete(): void {
    this.studentService.deleteStudent(this.student.id).subscribe(
      (successResponse) => {
        this.showMsgAndMoveToAnotherPage(
          'Student deleted successfully',
          this.studentPage
        );
      },
      (errorResponse) => {
        this.showMsgAndMoveToAnotherPage(
          'Error - failed to delete the Student!',
          this.studentPage
        );
      }
    );
  }

  OnAdd(): void {
    this.studentService.addStudent(this.student).subscribe(
      (successResponse) => {
        this.showMsgAndMoveToAnotherPage(
          'Student added successfully',
          this.studentPage + `/${successResponse.id}`
        );
      },
      (errorResponse) => {
        this.showMsgAndMoveToAnotherPage(
          'Error - failed to add new Student!',
          this.studentPage + '/add'
        );
      }
    );
  }

  showMsgAndMoveToAnotherPage(msg: string, path: string): void {
    this.snackBar.open(msg, undefined, {
      duration: this.waitDuration,
    });

    setTimeout(() => {
      this.router.navigateByUrl(path);
    }, this.waitDuration);
  }
}
