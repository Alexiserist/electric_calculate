import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select'
import {MatSlideToggleModule} from '@angular/material/slide-toggle';;
import { MatButtonModule} from '@angular/material/button';
import { PhaseElectric, TypeInstallation } from '../../interface/installation.interface';
import { branchCircuitFactor, convertInstallation, findingTempFactor } from '../../service/ambientTemp';

@Component({
  selector: 'app-installation-6',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonModule,
    MatSlideToggleModule        
  ],
  templateUrl: './installation-6.component.html',
  styleUrl: './installation-6.component.css'
})
export class Installation6Component {
  @Input() TypeInstallation: TypeInstallation = '1';
  @Input() PhaseElectric: PhaseElectric = '1';
  @Input() Current: number = 0;
  @Input() Temperature: number = 0;
  @Input() Component: number = 0;
  @Input() BranchCircuit: number = 0;
  @Output() deleteComponent = new EventEmitter<number>();
  dataForm: FormGroup;

  constructor(private formbuilder: FormBuilder) {
    this.dataForm = this.formbuilder.group({
      typeInsulation: [null],
      typeInductor: [null],
      diameter: ['-'],
      linebundle: [false],
      linebundleAmount : [1],
    });
  }

  currentTable: Record<string, number[]> = {
    pvc_group1: [
      21, 26, 35, 45, 57, 76, 99, 128, 154, 181, 223, 267, 304, 342, 386, 448, 507, 577, 654
    ],
    xlpe_group1: [
      33, 43, 55, 70, 92, 119, 152, 184, 217, 266, 318, 362, 406, 459, 533, 601, 684, 777
    ],


  };

  sizeWireRange = [
    1, 1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300, 400, 500 
  ];
  
  mappingGroupCondition: Record<string, string> = {  //amountinductor_typeInductor  // 2ตัวนำ_แกนเดี่ยว , 3ตัวนำ_หลายแกน
    '2': 'group1',
    '3': 'group2',
  };

  mappingConditionTable(): string {
    return 'group1';
  }

  mappingCurrentTable(group: string) {
    const typeInsulation = this.dataForm.get('typeInsulation')?.value;
    const dataKey = typeInsulation + '_' + group;
    console.log(this.currentTable[dataKey])
    return this.currentTable[dataKey];
  }

  findingSizeWire(data: number[], current: number) {
    if(!data) {
      return '-'
    }
    const index = data.findIndex((value) => value >= current);
    if (index == -1) {
      return '-';
    }
    return this.sizeWireRange[index] != 0 ? this.sizeWireRange[index] : '-';
  }

  calculating() {
    if(this.dataForm.invalid){
      this.dataForm.get('diameter')?.setValue('-');
      return;
    }
    const typeInsulation = this.dataForm.get('typeInsulation')?.value;
    let current = Number(this.Current);
    const mappingTemperatureData = convertInstallation(Number(this.TypeInstallation)) + "_" + typeInsulation;
    const ambientRatingFactor = findingTempFactor(Number(this.Temperature),mappingTemperatureData);
    const branchFactor =  branchCircuitFactor(this.BranchCircuit);

    const linebundleamounth = Number(this.dataForm.get('linebundleAmount')?.value);

    if(this.dataForm.get('linebundle')?.value){
      current = Math.ceil(current/linebundleamounth);
    }

    const ambientFactor = (branchFactor*ambientRatingFactor);

    current = Math.round(current/ambientFactor)  //safty factor

    const dataRange = this.mappingCurrentTable(this.mappingConditionTable());

    this.dataForm.get('diameter')?.setValue(this.findingSizeWire(dataRange, current));

  }

  onDelete() {
    this.deleteComponent.emit(this.Component);
  }
}

