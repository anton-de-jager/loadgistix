import { Injectable } from '@angular/core';

@Injectable()
export class VariableService {
    pageSelected: string;

    constructor(){
      this.pageSelected  = 'Home';
    }

    setPageSelected(val: string){
      this.pageSelected = val;
    }

    getPageSelected(){
      return this.pageSelected;
    }
}