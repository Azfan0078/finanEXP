import { TransactionsProxysService } from './../../../shared/proxys/transactionsProxys/transactions-proxys.service';
import { TransactionOutput } from 'src/app/shared/support/interfaces/transactions/transactionOutput';
import { GetAllFilter } from './../../../shared/support/interfaces/getAllFilter';
import { HttpErrorResponse } from '@angular/common/http';
import { ResponseDto } from 'src/app/shared/support/classes/responseDto';
import { take } from 'rxjs';
import { CustomersProxyService } from './../../../shared/proxys/customersProxys/customers-proxy.service';
import { Injectable } from '@angular/core';
import { CustomerInput } from 'src/app/shared/support/interfaces/customers/customerInput.interface';
import { Message } from 'src/app/shared/support/interfaces/message.interface';
import { CustomerOutput } from 'src/app/shared/support/interfaces/customers/customerOutput.interface';
import { UpdateFilter } from 'src/app/shared/support/interfaces/updateFilter';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  constructor(private customersProxyService: CustomersProxyService,
    private transactionsProxysService:TransactionsProxysService) {}

  public create(customer: CustomerInput, callback?: (data: Message) => void) {
    this.customersProxyService
      .create(customer)
      .pipe(take(1))
      .subscribe({
        next: (data: ResponseDto) => {
          if (callback) {
            callback(data.message);
          }
        },
        error: (error: HttpErrorResponse) => {
          if (callback) {
            callback(error.error.message);
          }
        },
      });
  }
  public update(customerId: string, customer: CustomerOutput, callback?: (data: Message) => void): void {
    this.customersProxyService
      .update(customerId, customer)
      .pipe(take(1))
      .subscribe({
        next: (data: ResponseDto) => {
          if (callback) {
            callback(data.message);
          }
        },
        error: (err: HttpErrorResponse) => {
          if (callback) {
            callback(err.error.message);
          }
        },
      });
  }
  public getAll(filter?:GetAllFilter, callback?: (data: ResponseDto<Array<CustomerOutput>>) => void): void {
    this.customersProxyService
      .getAll(filter)
      .pipe(take(1))
      .subscribe({
        next: (data: ResponseDto<Array<CustomerOutput>>) => {
          if (callback) {
            callback(data);
          }
        },
        error: (error: HttpErrorResponse) => {
          if (callback) {
            callback(error.error);
          }
        },
      });
  }
  public getById(customerId: string, callback?: (data: ResponseDto<CustomerOutput>) => void): void {
    this.customersProxyService
      .getById(customerId)
      .pipe(take(1))
      .subscribe({
        next: (data: ResponseDto<CustomerOutput>) => {
          if (callback) {
            callback(data);
          }
        },
        error: (err: HttpErrorResponse) => {
          if (callback) {
            err.error;
          }
        },
      });
  }
  public delete(customerId: string, callback?: (data: Message) => void) {
    this.customersProxyService
      .delete(customerId)
      .pipe(take(1))
      .subscribe({
        next: (data: ResponseDto) => {
          if (callback) {
            callback(data.message);
          }
        },
        error: (err: HttpErrorResponse) => {
          if (callback) {
            callback(err.error.message);
          }
        },
      });
  }
  public getAllTransactions(getAllFilter?:GetAllFilter, callback?:(data:ResponseDto<Array<TransactionOutput>>) => void){
    this.transactionsProxysService.getAll(getAllFilter).pipe(take(1)).subscribe({
      next:(data:ResponseDto<Array<TransactionOutput>>) => {
        if(callback){
          callback(data)
        }
      },
      error:(err:HttpErrorResponse) => {
        if(callback){
          callback(err.error)
        }
      }
    })
  }
  public archive(customer: CustomerOutput, callback?: (message: Message) => void) {
    this.customersProxyService.update(customer.id, customer, { toArchive: true } as UpdateFilter).pipe(take(1)).subscribe({
      next:(data:ResponseDto) => {
        if(callback){
          callback(data.message)
        }
      },
      error:(err:HttpErrorResponse) => {
        if(callback){
          callback(err.error.message)
        }
      }
    });
  }
  public unArchive(customer: CustomerOutput, callback?: (message: Message) => void){
    this.customersProxyService.update(customer.id, customer, { toArchive: false } as UpdateFilter).pipe(take(1)).subscribe({
      next:(data:ResponseDto) => {
        if(callback){
          callback(data.message)
        }
      },
      error:(err:HttpErrorResponse) => {
        if(callback){
          callback(err.error.message)
        }
      }
    });
  }
}
