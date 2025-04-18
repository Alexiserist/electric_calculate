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
  selector: 'app-installation-4',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonModule,
    MatSlideToggleModule,
  ],
  templateUrl: './installation-4.component.html',
  styleUrl: './installation-4.component.css',
})
export class Installation4Component {
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
      typeReplacement: [null],
      diameter: ['-'],
      linebundle: [false],
      linebundleAmount: [1],
    });
  }

  currentTable: Record<string, number[]> = {
    pvc_group1: [
      30, 39, 56, 78, 113, 141, 171, 221, 271, 315, 365, 418, 495, 573, 692,
    ],
    pvc_group2: [
      37, 48, 67, 92, 127, 157, 191, 244, 297, 345, 397, 453, 535, 617, 741,
    ],
    xlpe_group1: [
      47, 60, 82, 110, 147, 183, 224, 289, 354, 413, 480, 551, 654, 758, 917,
      1064,
    ],
    xlpe_group2: [
      54, 68, 90, 124, 166, 206, 250, 321, 391, 455, 525, 602, 711, 821, 987,
      1140,
    ],
  };

  sizeWireRange = [
    4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300, 400,
  ];

  mappingGroupCondition: Record<string, string> = {
    //amountinductor_typeInductor  // 2ตัวนำ_แกนเดี่ยว , 3ตัวนำ_หลายแกน
    vertical: 'group1',
    horizontal: 'group2',
  };

  mappingConditionTable(): string {
    const typeReplacement = this.dataForm.get('typeReplacement')?.value;
    const key = `${typeReplacement}`;
    return this.mappingGroupCondition[key] || 'group1';
  }

  mappingCurrentTable(group: string) {
    const typeInsulation = this.dataForm.get('typeInsulation')?.value;
    const dataKey = typeInsulation + '_' + group;
    return this.currentTable[dataKey];
  }

  findingSizeWire(data: number[], current: number) {
    if (!data) {
      return '-';
    }
    const index = data.findIndex((value) => value >= current);
    if (index == -1) {
      return '-';
    }
    return this.sizeWireRange[index] != 0 ? this.sizeWireRange[index] : '-';
  }

  calculating() {
    if (this.dataForm.invalid) {
      this.dataForm.get('diameter')?.setValue('-');
      return;
    }
    const typeInsulation = this.dataForm.get('typeInsulation')?.value;
    let current = Number(this.Current);
    const mappingTemperatureData =
      convertInstallation(Number(this.TypeInstallation)) + '_' + typeInsulation;
    const ambientRatingFactor = findingTempFactor(
      Number(this.Temperature),
      mappingTemperatureData
    );
    const branchFactor = branchCircuitFactor(this.BranchCircuit);

    const linebundleamounth = Number(
      this.dataForm.get('linebundleAmount')?.value
    );
    if (this.dataForm.get('linebundle')?.value) {
      current = Math.ceil(current / linebundleamounth);
    }

    const ambientFactor = branchFactor * ambientRatingFactor;

    current = Math.round(current / ambientFactor);

    const dataRange = this.mappingCurrentTable(this.mappingConditionTable());

    this.dataForm
      .get('diameter')
      ?.setValue(this.findingSizeWire(dataRange, current));
  }

  onDelete() {
    this.deleteComponent.emit(this.Component);
  }
}
