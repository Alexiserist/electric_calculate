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
  selector: 'app-installation-5',
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
  templateUrl: './installation-5.component.html',
  styleUrl: './installation-5.component.css'
})
export class Installation5Component {
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
      17,21 ,28 ,36, 46, 62, 81, 106, 129, 153, 190, 232, 265, 303, 344, 404, 462, 529, 605
    ],
    pvc_group2: [
      15, 19, 25, 33, 41, 55 ,72, 94, 114, 136, 168, 204, 234, 266 ,303, 361, 404, 462, 527
    ],
    xlpe_group1: [
      25, 33, 43, 54, 71, 94, 124, 150, 180, 223, 271, 313, 355, 406, 477, 543, 625, 717
    ],
    xlpe_group2: [
      22, 29, 38, 47, 63, 83, 109, 132, 159, 196, 238, 275, 312, 356, 418, 475, 545, 623
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
    const convertAmountIncductor: Record<string,string> = {
      '1' : "2",
      '3' : '3'
    }
    const phaseElectric = convertAmountIncductor[this.PhaseElectric];
    const key = `${phaseElectric}`;
    return this.mappingGroupCondition[key] || 'group1';
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

