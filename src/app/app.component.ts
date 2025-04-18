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
import { Installation3Component } from "./components/installation-3/installation-3.component";
import { Installation4Component } from "./components/installation-4/installation-4.component";
import { Installation5Component } from "./components/installation-5/installation-5.component";
import { Installation6Component } from "./components/installation-6/installation-6.component";
import { Installation7Component } from "./components/installation-7/installation-7.component";

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
    Installation2Component,
    Installation3Component,
    Installation4Component,
    Installation5Component,
    Installation6Component,
    Installation7Component
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  @ViewChildren(Installation1Component) installation1Comp! : QueryList<Installation1Component>;
  @ViewChildren(Installation7Component) installation7Comp! : QueryList<Installation7Component>;

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
  }

  constructor(private formbuilder: FormBuilder) {
    this.dataForm = this.formbuilder.group({
      phase: [1],
      typeInstallation: [7],
      current: [null],
      temperature: [40],
      trayInstallation: ['1'],
      wireInstallation: ['1'],
    });
  }

  onTrayChangeTrigger(){
    setTimeout(() => {
      this.installation7Comp.forEach((comp) => comp.showTypeInductorSelected())
    }, 100);
  }

  onshowWireinstallation(){
    const typeInstallation = this.dataForm.get('typeInstallation')?.value;
    const trayInstallation = this.dataForm.get('trayInstallation')?.value;
    if(typeInstallation != '7'){
      this.dataForm.get('wireInstallation')?.disable();
      return false
    }
    const trayExcludeList = ['4', '6', '7', '8', '9'];
    if (trayExcludeList.includes(trayInstallation)) {
      this.dataForm.get('wireInstallation')?.disable();
      return false;
    }
    this.dataForm.get('wireInstallation')?.enable();
    return true
  }

  get shouldShowWireInstallation(): boolean {
    return this.onshowWireinstallation();
  }
  

  onDeleteTrigger(deletedComponent: number) {
    const typeInstallation = this.dataForm.get('typeInstallation')?.value;
    this.groupBranchCircuit[typeInstallation].splice(deletedComponent, 1);
    setTimeout(() => {
      this.installation1Comp.forEach(comp => comp.calculating());
    }, 100);
  }

  addBranch(){
    const typeInstallation = this.dataForm.get('typeInstallation')?.value;
    this.groupBranchCircuit[typeInstallation].push({id: this.groupBranchCircuit[typeInstallation].length + 1})
    setTimeout(() => {
      this.installation1Comp.forEach(comp => comp.calculating());
      if(typeInstallation == '7'){
        this.installation7Comp.forEach(comp => comp.showTypeInductorSelected());
      }
    }, 200);

  }

  trackByFn(index: number, item: any): number {
    return item.id; 
  }

}
