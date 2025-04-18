import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { PhaseElectric, TrayInstallation, TypeInstallation } from '../../interface/installation.interface';
import { branchCircuitFactor, convertInstallation, findingTempFactor } from '../../service/ambientTemp';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SolutionComponent } from '../solution/solution.component';

@Component({
  selector: 'app-installation-7',
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
    MatDialogModule,
  ],
  templateUrl: './installation-7.component.html',
  styleUrl: './installation-7.component.css',
})
export class Installation7Component {
  readonly dialog = inject(MatDialog);
  @Input() TypeInstallation: TypeInstallation = '1';
  @Input() PhaseElectric: PhaseElectric = '1';
  @Input() Current: number = 0;
  @Input() Temperature: number = 0;
  @Input() Component: number = 0;
  @Input() BranchCircuit: number = 0;
  @Input() TrayInstallation: TrayInstallation = '1';
  @Input() WireInstallation: string = '1';
  @Output() deleteComponent = new EventEmitter<number>();
  dataForm: FormGroup;

  constructor(private formbuilder: FormBuilder) {
    this.dataForm = this.formbuilder.group({
      typeInsulation: [null],
      typeInductor: [null],
      typeInstalltion: [null],
      diameter: ['-'],
      linebundle: [false],
      linebundleAmount: [1],
    });
    this.dataForm.get('typeInductor')?.disable();
  }

  currentTable: Record<string, number[]> = {
    pvc_group1: [0, 0, 0, 0, 0, 0, 0, 99, 124, 151, 196, 239, 279, 324, 371, 441, 511, 599, 686],
    pvc_group2: [0, 0, 0, 0, 0, 0, 0, 96, 119, 145, 188, 230, 268, 310, 356, 422, 488, 571, 652],
    pvc_group3: [0, 0, 0, 0, 0, 0, 0, 127, 157, 191, 244, 297, 345, 397, 453, 535, 617, 741, 854],
    pvc_group4: [0, 0, 0, 0, 0, 0, 0, 113, 141, 171, 221, 271, 315, 365, 418, 495, 573, 692, 800],
    pvc_group5: [13, 16, 22, 30, 37, 52, 70, 88, 110, 133, 171, 207, 240, 278, 317, 374, 432, 0, 0],
    pvc_group6: [0, 0, 0, 0, 0, 0, 0, 90, 112, 145, 186, 227, 264, 304, 348, 411, 474, 552, 629],
    pvc_group7: [0, 0, 0, 0, 0, 0, 0, 77, 96, 117, 149, 180, 208, 228, 258, 301, 343, 406, 464],
    pvc_group8: [12, 15, 21, 28, 36, 50, 66, 84, 104, 125, 160, 194, 225, 260, 297, 351, 404, 0, 0],
    pvc_group9: [10, 13, 17, 23, 30, 40, 54, 70, 86, 103, 130, 156, 179, 196, 222, 258, 295, 0, 0],
    xlpe_group1: [0, 0, 0, 0, 0, 0, 0, 128, 160, 197, 254, 311, 364, 422, 485, 577, 670, 790, 908],
    xlpe_group2: [0, 0, 0, 0, 0, 0, 0, 123, 154, 188, 244, 298, 349, 404, 464, 552, 640, 749, 861],
    xlpe_group3: [0, 0, 0, 0, 0, 0, 0, 166, 206, 250, 321, 391, 455, 525, 602, 711, 821, 987, 1140],
    xlpe_group4: [0, 0, 0, 0, 0, 0, 0, 147, 183, 224, 289, 354, 413, 480, 551, 654, 758, 917, 1064],
    xlpe_group5: [16, 21, 29, 38, 49, 68, 91, 116, 144, 175, 224, 271, 315, 363, 415, 490, 565, 0, 0],
    xlpe_group6: [0, 0, 0, 0, 0, 0, 0, 0, 118, 147, 190, 244, 297, 345, 397, 455, 537, 620, 722, 823],
    xlpe_group7: [0, 0, 0, 0, 0, 0, 0, 0, 106, 131, 159, 202, 245, 284, 311, 349, 410, 468, 531, 606],
    xlpe_group8: [15, 20, 27, 36, 47, 65, 87, 108, 134, 163, 208, 253, 293, 338, 386, 455, 524, 0, 0],
    xlpe_group9: [14, 18, 24, 32, 40, 55, 73, 96, 116, 140, 177, 212, 244, 273, 309, 362, 414, 0, 0],
  };

  sizeWireRange = [1, 1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300, 400, 500];

  mappingGroupCondition: Record<string, string> = {
    //amountinductor_typeInductor  // 2ตัวนำ_แกนเดี่ยว , 3ตัวนำ_หลายแกน
    '1_single': 'group1',
    '2_single': 'group2',
    '3_single': 'group3',
    '4_single': 'group4',
    '5_multiple': 'group5',
    '6_single': 'group6',
    '7_single': 'group7',
    '8_multiple': 'group8',
    '9_multiple': 'group9',
  };

  showTypeInductorSelected() {
    if (this.TrayInstallation === '5' || this.TrayInstallation === '8' || this.TrayInstallation === '9') {
      this.dataForm.get('typeInductor')?.setValue('multiple');
    } else {
      this.dataForm.get('typeInductor')?.setValue('single');
    }
  }

  mappingConditionTable(): string {
    const typeInductor = this.dataForm.get('typeInductor')?.value;
    const typeInstallation = this.dataForm.get('typeInstalltion')?.value;

    const key = `${typeInstallation}_${typeInductor}`;
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
    const mappingTemperatureData = convertInstallation(Number(this.TypeInstallation)) + '_' + typeInsulation;
    const ambientRatingFactor = findingTempFactor(Number(this.Temperature), mappingTemperatureData);
    const linebundleamounth = Number(this.dataForm.get('linebundleAmount')?.value);

    if (this.dataForm.get('linebundle')?.value) {
      current = Math.ceil(current / linebundleamounth);
    }
    const typeInstallationAndWire = `${this.TrayInstallation}_${this.WireInstallation}`;
    let branchFactor = 1;
    if (ambientCableTray[typeInstallationAndWire]) {
      const totalCableInTray = +this.BranchCircuit + linebundleamounth;
      const index = calbleInTray.findIndex((value) => value >= totalCableInTray);
      branchFactor = ambientCableTray[typeInstallationAndWire][index];
    } else {
      branchFactor = branchCircuitFactor(this.BranchCircuit);
    }


    console.log(branchFactor, ambientRatingFactor)

    const ambientFactor = branchFactor * ambientRatingFactor;

    current = Math.round(current / ambientFactor); //safty factor

    const dataRange = this.mappingCurrentTable(this.mappingConditionTable());

    this.dataForm.get('diameter')?.setValue(this.findingSizeWire(dataRange, current));
  }

  onDelete() {
    this.deleteComponent.emit(this.Component);
  }

  openDialog() {
    const dialogRef = this.dialog.open(SolutionComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

const ambientCableTray: Record<string, number[]> = {
  '1_1': [1, 0.91, 0.87, 0.82, 0.78, 0.77],
  '1_2': [1, 0.86, 0.8, 0.75, 0.71, 0.7],
  '1_3': [1, 0.97, 0.96, 0.94, 0.93, 0.92],
  '2_1': [1, 0.98, 0.96, 0.93, 0.89, 0.89],
  '2_2': [1, 0.91, 0.89, 0.88, 0.87, 0.87],
  '2_3': [1, 1, 1, 1, 1, 1],
  '3_1': [1, 0.93, 0.9, 0.87, 0.83, 0.83],
  '3_2': [1, 0.97, 0.96, 0.96, 0.96, 0.96],
  '5_1': [1, 0.88, 0.82, 0.77, 0.73, 0.72],
  '5_2': [1, 0.87, 0.82, 0.8, 0.79, 0.78],
  '5_3': [1, 0.88, 0.82, 0.77, 0.73, 0.72],
  '5_4': [1, 1, 0.98, 0.95, 0.91, 0.91],
  '5_5': [1, 1, 1, 1, 1, 1],
  '5_6': [1, 0.91, 0.89, 0.88, 0.87, 0.87],
};

const calbleInTray = [1, 2, 3, 4, 6, 9];
