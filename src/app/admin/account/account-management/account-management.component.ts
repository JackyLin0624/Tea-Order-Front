import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { UserService } from '../../../service/user.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { CreateUserDialogComponent } from '../create-user-dialog/create-user-dialog.component';
import { ModifyUserDialogComponent } from '../modify-user-dialog/modify-user-dialog.component';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-account-management',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatPaginatorModule],
  templateUrl: './account-management.component.html',
  styleUrl: './account-management.component.scss'
})

export class AccountManagementComponent implements AfterViewInit {
  displayedColumns: string[] = ['position', 'account', 'userName', 'role', 'modify', 'delete'];
  dataSource: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {

  }

  constructor(
    private userService: UserService,
    private dialog: MatDialog
  ) {
    this.refresh();
  }
  refresh() {
    this.userService.getAllUsers().subscribe({
      next: data => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        console.log(data);
      },
      error: error => {

      },
      complete: () => {

      }
    })
  }
  openCreateUserDialog() {
    const dialogRef = this.dialog.open(CreateUserDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        location.reload();
      }

    });
  }
  openModifyUserDialog(user: any) {
    const dialogRef = this.dialog.open(ModifyUserDialogComponent, {
      width: '400px',
      data: user.id
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refresh();
      }

    });
  }

  delete(user: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { title: '刪除帳號', message: `確定要刪除這個帳號:${user.account}嗎？` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        var req = {
          userId: user.id
        }
        this.userService.deleteUser(req).subscribe({
          next: data => {
            console.log(data);
          },
          error: error => {
            if (error.status === 401) {
              this.refresh();
            }
          },
          complete: () => {

          }
        })
      } else {

      }
    });
  }
}
