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
  selector: 'app-installation-2',
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
  templateUrl: './installation-2.component.html',
  styleUrl: './installation-2.component.css'
})
export class Installation2Component {
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
      12, 15, 21, 28, 36, 50, 66, 88, 109, 131, 167, 202, 234, 261, 297, 348,
      398, 475, 545,
    ],
    pvc_group2: [
      11, 14, 20, 26, 33, 45, 60, 78, 97, 116, 146, 175, 202, 224, 256, 299,
      343, 0, 0,
    ],
    pvc_group3: [
      10, 13, 18, 24, 31, 44, 59, 77, 96, 117, 149, 180, 208, 228, 258, 301,
      343, 406, 464,
    ],
    pvc_group4: [
      10, 13, 17, 23, 30, 40, 54, 70, 86, 103, 130, 156, 179, 196, 222, 258,
      295, 0, 0,
    ],
    xlpe_group1: [
      15, 21, 28, 38, 49, 68, 91, 121, 149, 180, 230, 278, 322, 358, 409, 480, 549, 622, 713
    ],
    xlpe_group2: [
      15, 20, 27, 36, 46, 63, 83, 108, 133, 159, 201, 241, 278, 304, 349, 419, 484, 0, 0
    ],
    xlpe_group3: [
      14, 18, 25, 34, 44, 60, 80, 106, 131, 159, 202, 245, 284, 311, 349, 410, 468, 531, 606
    ],
    xlpe_group4: [
      14, 18, 24, 32, 40, 55, 73, 96, 116, 140, 177, 212, 244, 273, 309, 362, 414, 0, 0
    ],
  };

  sizeWireRange = [
    1, 1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300, 400,
    500,
  ];
  
  mappingGroupCondition: Record<string, string> = {  //amountinductor_typeInductor  // 2ตัวนำ_แกนเดี่ยว , 3ตัวนำ_หลายแกน
    '2_single': 'group1',
    '2_multiple': 'group2',
    '3_single': 'group3',
    '3_multiple': 'group4',
  };

  mappingConditionTable(): string {
    const typeInductor = this.dataForm.get('typeInductor')?.value;
    const convertAmountIncductor: Record<string,string> = {
      '1' : "2",
      '3' : '3'
    }
    const phaseElectric = convertAmountIncductor[this.PhaseElectric];
    const key = `${phaseElectric}_${typeInductor}`;
    return this.mappingGroupCondition[key] || 'group1';
  }

  mappingCurrentTable(group: string) {
    const typeInsulation = this.dataForm.get('typeInsulation')?.value;
    const dataKey = typeInsulation + '_' + group
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

