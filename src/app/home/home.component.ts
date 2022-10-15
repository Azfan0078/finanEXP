import { UserService } from './services/user.service';
import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

import { Subscription, take } from 'rxjs';

import { UserHandlerService } from '../shared/handlers/user-handler.service';

import { MatSidenav } from '@angular/material/sidenav';
import UserOutput from '../shared/support/interfaces/user/userOutput.interface';
import { UserHandler } from 'src/app/shared/support/classes/user-handler';
import ResponseGetUserByIdDto from '../shared/support/classes/responseGetUserByIdDto';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent extends UserHandler implements OnInit, OnDestroy {
  public isExtended = false;
  private viewPortSizeObserver!: Subscription;

  override currentUser: UserOutput = {
    id: '',
    name: '',
    email: '',
  };

  @ViewChild(MatSidenav) sideNave!: MatSidenav;

  constructor(
    private observer: BreakpointObserver,
    private route: ActivatedRoute,
    private userService: UserService,
    userHandlerService: UserHandlerService
  ) {
    super(userHandlerService);
  }
  override ngOnInitFunction(): void {
    this.startViewPortSizeObserver();

    this.getCurrentUser();
  }
  override ngOnDestroyFunction(): void {
    this.viewPortSizeObserver.unsubscribe();
  }

  private getCurrentUser() {
    let currentUserId = '';

    this.route.data.pipe(take(1)).subscribe({
      next: (data: any) => {
        currentUserId = data['currentUserId'].token;
      },
    });
    this.userService.getUserById(currentUserId, (data: ResponseGetUserByIdDto) => {
      this.currentUser = data.user;
    });
  }

  private startViewPortSizeObserver() {
    this.viewPortSizeObserver = this.observer.observe(['(max-width:800px)']).subscribe((res: BreakpointState) => {
      if (res.matches) {
        this.isExtended = false;
        this.sideNave?.close();
      } else {
        this.isExtended = true;
        this.sideNave?.open();
      }
    });
  }
}
