import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AddTodo } from '@app/modules/ngxs-tutorial/modules/todo/actions/todo.actions';
import { Store } from '@ngxs/store';

@Component({
	selector: 'validation-ex',
	templateUrl: './validation-ex.component.html',
	styleUrls: ['./validation-ex.component.scss'],
})
export class ValidationExComponent implements OnInit {
	public todoForm: FormGroup;

	public get userId(): FormControl {
		return this.todoForm.controls.userId as FormControl;
	}

	public get country(): FormControl {
		return this.todoForm.controls.country as FormControl;
	}

	public get email(): FormControl {
		return this.todoForm.controls.email as FormControl;
	}

	constructor(private store: Store, private formBuilder: FormBuilder) {}

	ngOnInit(): void {
		this.todoForm = this.formBuilder.group({
			email: ['', [Validators.required, Validators.email]],
			country: ['', Validators.required],
			userId: ['', Validators.required],
		});
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
