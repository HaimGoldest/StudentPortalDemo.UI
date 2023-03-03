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

  isNewStudent = false;
  header = '';
  displayProfileImageUrl = '';

  genderList: Gender[] = [];
  waitDuration = 2000;

  constructor(
    private readonly studentService: StudentService,
    private readonly route: ActivatedRoute,
    private readonly genderService: GenderService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.studentId = params.get('id');

      if (this.studentId) {
        // if new student
        if (this.studentId.toLowerCase() === 'add') {
          this.isNewStudent = true;
          this.header = 'Add New Student';
          this.setImage();
        } else {
          this.isNewStudent = false;
          this.header = 'Edit Student';

          this.studentService.getStudent(this.studentId).subscribe(
            (successResponse) => {
              this.student = successResponse;
              this.setImage();
            },
            (errorResponse) => {
              this.setImage();
            }
          );
        }

        this.genderService.getGenderList().subscribe((successResponse) => {
          this.genderList = successResponse;
        });
      }
    });
  }

  OnUpdate(): void {
    this.studentService.updateStudent(this.student.id, this.student).subscribe(
      (successResponse) => {
        this.showMsg('Student updated successfully');
        this.waitAndMoveToAnotherPage(this.studentPage);
      },
      (errorResponse) => {
        this.showMsg('Error - failed to update the Student!');
      }
    );
  }

  OnDelete(): void {
    this.studentService.deleteStudent(this.student.id).subscribe(
      (successResponse) => {
        this.showMsg('Student deleted successfully');
        this.waitAndMoveToAnotherPage(this.studentPage);
      },
      (errorResponse) => {
        this.showMsg('Error - failed to delete the Student!');
      }
    );
  }

  OnAdd(): void {
    this.studentService.addStudent(this.student).subscribe(
      (successResponse) => {
        this.showMsg('Student added successfully');
        this.waitAndMoveToAnotherPage(this.studentPage);
      },
      (errorResponse) => {
        this.showMsg('Error - failed to add new Student!');
      }
    );
  }

  uploadImage(event: any): void {
    if (this.studentId) {
      const file: File = event.target.files[0];
      this.studentService.uploadImage(this.student.id, file).subscribe(
        (successResponse) => {
          this.student.profileImageUrl = successResponse;
          this.setImage();
          this.showMsg('Profile Image Updated');
        },
        (errorResponse) => {
          this.showMsg('Error - failed to update the profile Image!');
        }
      );
    }
  }

  private setImage() {
    if (this.student.profileImageUrl) {
      this.displayProfileImageUrl = this.studentService.getImagePath(
        this.student.profileImageUrl
      );
    } else {
      //display a default
      this.displayProfileImageUrl = '/assets/user.png';
    }
  }

  private showMsg(msg: string): void {
    this.snackBar.open(msg, undefined, {
      duration: this.waitDuration,
    });
  }

  private waitAndMoveToAnotherPage(path: string): void {
    setTimeout(() => {
      this.router.navigateByUrl(path);
    }, this.waitDuration);
  }

  // private waitAndMhowMsgAndMoveToAnotherPage(msg: string, path: string): void {
  //   this.snackBar.open(msg, undefined, {
  //     duration: this.waitDuration,
  //   });

  //   setTimeout(() => {
  //     this.router.navigateByUrl(path);
  //   }, this.waitDuration);
  // }
}
