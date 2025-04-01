import { CommonModule } from '@angular/common';
import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Installation1Component } from "./components/installation-1/installation-1.component";
import { MatButtonModule } from '@angular/material/button';
import { Installation2Component } from "./components/installation-2/installation-2.component";

export interface User {
  name: string;
}

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonModule,
    Installation1Component,
    Installation2Component
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  @ViewChildren(Installation1Component) installation1Comp! : QueryList<Installation1Component>;
  title = 'electric-calculate';
  options: string[] = ['one', 'two', 'three'];
  branchCircuit: {id: number}[] = [];
  dataForm: FormGroup;

  groupBranchCircuit: {[typeInstallation:number]: {id: number}[]} = { 
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: []
  }

  constructor(private formbuilder: FormBuilder) {
    this.dataForm = this.formbuilder.group({
      phase: [1],
      typeInstallation: [1],
      current: [null],
      temperature: [40],
    });
  }
  

  onDeleteTrigger(deletedComponent: number) {
    const typeInstallation = this.dataForm.get('typeInstallation')?.value;
    this.groupBranchCircuit[typeInstallation].splice(deletedComponent, 1);
    setTimeout(() => {
      this.installation1Comp.forEach(comp => comp.calculating());
    }, 200);
  }

  addBranch(){
    const typeInstallation = this.dataForm.get('typeInstallation')?.value;
    this.groupBranchCircuit[typeInstallation].push({id: this.groupBranchCircuit[typeInstallation].length + 1})
    setTimeout(() => {
      this.installation1Comp.forEach(comp => comp.calculating());
    }, 200);
  }

  trackByFn(index: number, item: any): number {
    return item.id; 
  }

}
