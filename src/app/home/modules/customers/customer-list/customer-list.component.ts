import { ActivatedRoute } from '@angular/router';
import { GetAllFilter } from './../../../../shared/support/interfaces/getAllFilter';
import { CustomerEditorDialogDataInterface } from 'src/app/shared/support/interfaces/customers/customerEditorDialogData.interface';
import { CustomersService } from './../customers.service';
import { CustomerDetailsDialogComponent } from './customer-details-dialog/customer-details-dialog.component';
import { CustomerEdtiorDialogComponent } from './../customer-edtior-dialog/customer-edtior-dialog.component';
import { DialogControlService } from './../../../../shared/support/services/dialogControl/dialog-control.service';
import { Component, Input, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
import { CustomerOutput } from 'src/app/shared/support/interfaces/customers/customerOutput.interface';
import { customerTypesOptionsPortuguese } from 'src/app/shared/support/enums/customer-types-options-portuguese';
import { ResponseDto } from 'src/app/shared/support/classes/responseDto';
import { Subscription } from 'rxjs';
import { transactionUpdatedHandler } from 'src/app/shared/handlers/transactionHandler/transactionUpdatedHandler';
import { customerUpdateHandler } from 'src/app/shared/handlers/customerHandler/customerUpdateHandler';

registerLocaleData(ptBr);

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css'],
  providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }],
})
export class CustomerListComponent {
  @Input() public customers!: Array<CustomerOutput>;
  @Input() public isArchivedComponent = false;
  public type!: string;
  public customerTypesOptionsPortuguese = customerTypesOptionsPortuguese;

  private subscriptions: Array<Subscription> = [];

  constructor(
    private dialogControlService: DialogControlService,
    private customersService: CustomersService,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.getIsArchivedComponent();
    this.subscriptions.push(
      transactionUpdatedHandler.subscribe(() => {
        this.getAllCustomers();
      })
    );
    this.subscriptions.push(
      customerUpdateHandler.subscribe((customers: Array<CustomerOutput>) => {
        this.customers = customers;
        if (this.isArchivedComponent) {
          this.customers = this.customers.filter((customer: CustomerOutput) => customer.isArchived);
        } else {
          this.customers = this.customers.filter((customer: CustomerOutput) => !customer.isArchived);
        }
      })
    );
  }
  public showDetails(customerId: string): void {
    this.dialogControlService
      .openDialog(CustomerDetailsDialogComponent, {
        width: '650px',
        height: '500px',
        data: customerId,
      })
      .afterClosed()
      .subscribe({
        next: (data: { updated: boolean; isArchivedComponent: boolean }) => {
          if (data?.updated) {
            this.getAllCustomers();
          }
        },
      });
  }
  public openCustomerEditorDialog(): void {
    this.dialogControlService
      .openDialog(CustomerEdtiorDialogComponent, {
        width: '650px',
        height: '500px',
        data: {
          operation: 'create',
        } as CustomerEditorDialogDataInterface,
      })
      .afterClosed()
      .subscribe({
        next: () => {
          this.getAllCustomers();
        },
      });
  }
  private getAllCustomers() {
    const filter = {
      isArchived: false,
    } as GetAllFilter;
    if (this.isArchivedComponent) {
      filter.isArchived = true;
    }
    this.customersService.getAll(filter, (data: ResponseDto<Array<CustomerOutput>>) => {
      this.customers = <Array<CustomerOutput>>data.content;
    });
  }
  private getIsArchivedComponent() {
    if (this.route.snapshot.url.length && this.route.snapshot.url[0].path === 'archived') {
      this.isArchivedComponent = true;
    }
  }
}
