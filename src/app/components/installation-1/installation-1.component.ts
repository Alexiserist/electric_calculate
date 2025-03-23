import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
@Component({
  selector: 'app-installation-1',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './installation-1.component.html',
  styleUrl: './installation-1.component.css',
})
export class Installation1Component {
  @Input() TypeInstallation: string = '1';
  dataForm: FormGroup;

  constructor(private formbuilder: FormBuilder) {
    this.dataForm = this.formbuilder.group({
      amountInductor: [null],
      typeInductor: [null],
      current: [null],
      safetyFactor: [0],
      diameter: ['-'],
    });
  }

  currentTable: Record<string, number[]> = {
    group1: [
      10, 13, 17, 23, 30, 40, 53, 70, 86, 104, 131, 158, 183, 209, 238, 279,
      319, 0, 0,
    ],
    group2: [
      10, 12, 16, 22, 28, 37, 50, 65, 80, 96, 121, 145, 167, 191, 216, 253, 291,
      0, 0,
    ],
    group3: [
      9, 12, 16, 21, 27, 37, 49, 64, 77, 94, 118, 143, 164, 188, 213, 249, 285,
      0, 0,
    ],
    group4: [
      9, 11, 15, 20, 25, 34, 45, 59, 72, 86, 109, 131, 150, 171, 194, 227, 259,
      0, 0,
    ],
    group5: [
      12, 15, 21, 28, 36, 50, 66, 88, 109, 131, 167, 202, 234, 261, 297, 348,
      398, 475, 545,
    ],
    group6: [
      11, 14, 20, 26, 33, 45, 60, 78, 97, 116, 146, 175, 202, 224, 256, 299,
      343, 0, 0,
    ],
    group7: [
      10, 13, 18, 24, 31, 44, 59, 77, 96, 117, 149, 180, 208, 228, 258, 301,
      343, 406, 464,
    ],
    group8: [
      10, 13, 17, 23, 30, 40, 54, 70, 86, 103, 130, 156, 179, 196, 222, 258,
      295, 0, 0,
    ],
  };
  mappingCondition: Record<string, string> = {
    '1_2_single': 'group1',
    '1_2_multiple': 'group2',
    '1_3_single': 'group3',
    '1_3_multiple': 'group4',
    '2_2_single': 'group5',
    '2_2_multiple': 'group6',
    '2_3_single': 'group7',
    '2_3_multiple': 'group8',
  };
  
  sizeWireRange = [
    1, 1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300, 400,
    500,
  ];

  mappingConditionTable(): string {
    const typeInstallation = this.TypeInstallation;
    const amountInductor = this.dataForm.get('amountInductor')?.value;
    const typeInductor = this.dataForm.get('typeInductor')?.value;
    const key = `${typeInstallation}_${amountInductor}_${typeInductor}`;
    return this.mappingCondition[key] || 'group1';
  }

  mappingTable(value: string) {
    return this.currentTable[value];
  }

  findingSizeWire(data: number[], current: number) {
    const index = data.findIndex((value) => value >= current);
    if (index == -1) {
      return '-';
    }
    return this.sizeWireRange[index] != 0 ? this.sizeWireRange[index] : '-';
  }

  calculating() {
    const amountInductor = this.dataForm.get('amountInductor')?.value;
    const typeInductor = this.dataForm.get('typeInductor')?.value;
    const current = parseInt(this.dataForm.get('current')?.value);
    const safetyFactor = this.dataForm.get('safetyFactor')?.value || 0;
    const currentSafety = current + Math.round(current * (safetyFactor / 100));
    if (!amountInductor || !typeInductor || !current) {
      this.dataForm.get('diameter')?.setValue('-');
      return;
    }
    const dataRange = this.mappingTable(this.mappingConditionTable());
    this.dataForm.get('diameter')?.setValue(this.findingSizeWire(dataRange, currentSafety));

  }
}
