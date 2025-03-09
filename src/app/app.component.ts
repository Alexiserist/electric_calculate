import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatSelectModule} from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { map, Observable, of, startWith } from 'rxjs';
import { Installation1Component } from "./components/installation-1/installation-1.component";

export interface User {
  name: string;
}

@Component({
  selector: 'app-root',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatSelectModule,
    Installation1Component
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'electric-calculate';
  options: string[] = ['one', 'two', 'three'];
  dataForm: FormGroup;
  filteredOption: Observable<string[]> = of([]);

  constructor(private formbuilder: FormBuilder) {
    this.dataForm = this.formbuilder.group({
      test: [null],
    });
    this.filteredOption =
      this.dataForm.get('test')?.valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value || ''))
      ) || of([]);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLocaleLowerCase();
    return this.options.filter((value) =>
      value.toLocaleLowerCase().includes(filterValue)
    );
  }
}
