/* eslint-disable max-len */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, of, switchMap } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaystackService {
  baseUrl = environment.apiDotNet;

  constructor(
    private http: HttpClient
  ) { }


  getPlans(test:boolean): Observable<any> {
      return this.http.get(environment.paystack_url, { headers: { 'Authorization': 'Bearer ' + (!test ? environment.paystack_secretKey : environment.paystack_secretKey_test), 'Content-Type': 'application/json' } })
  }

    addPlan(params: any, test: boolean): Observable<any> {
        return this.http.post(environment.paystack_url, params, { headers: { 'Authorization': 'Bearer ' + (!test ? environment.paystack_secretKey : environment.paystack_secretKey_test), 'Content-Type': 'application/json' } })
  }

    updatePlan(plan_code: string, params: any, test: boolean): Observable<any> {
        return this.http.put(environment.paystack_url + '/' + plan_code, params, { headers: { 'Authorization': 'Bearer ' + (!test ? environment.paystack_secretKey : environment.paystack_secretKey_test), 'Content-Type': 'application/json' } })
  }
}
