import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AddTodo } from '@app/modules/ngxs-tutorial/modules/todo/actions/todo.actions';
import { Store } from '@ngxs/store';

@Component({
	selector: 'validation-ex',
	templateUrl: './validation-ex.component.html',
	styleUrls: ['./validation-ex.component.scss'],
})
export class ValidationExComponent implements OnInit {
	public todoForm: FormGroup;

	public countries = [
		{ value: 'UA', text: 'Ukraine' },
		{ value: 'CAN', text: 'Canada' },
		{ value: 'USA', text: 'United State of America' },
	];

	public get projects(): FormArray {
		return this.todoForm.get('projects') as FormArray;
	}

	constructor(private store: Store, private formBuilder: FormBuilder) {}

	ngOnInit(): void {
		this.todoForm = this.formBuilder.group({
			firstName: [''], // marked as required in html
			lastName: [''], // marked as required in html
			email: ['', [Validators.required, Validators.email]],
			country: ['', Validators.required],

			projects: this.formBuilder.array([]),
		});
	}

	public addNewProject(): void {
		this.projects.push(
			this.formBuilder.group({
				projectName: ['', Validators.required],
				projectYear: [0, [Validators.min(2000), Validators.max(2025)]],
				projectValue: [0, [Validators.required, Validators.min(5_000)]],
			})
		);
	}

	public deleteProject(index: number): void {
		this.projects.removeAt(index);
	}

	public onSubmit(): void {
		this.store.dispatch(new AddTodo(this.todoForm.value)).subscribe(() => {
			this.todoForm.reset();
		});
	}

	public reset(): void {
		this.todoForm.reset();
	}
}
