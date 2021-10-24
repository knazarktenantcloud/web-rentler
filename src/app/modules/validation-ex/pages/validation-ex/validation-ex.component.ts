import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
		{ value: 'USA', text: 'United State of America' },
		{ value: 'CAN', text: 'Canada' },
		{ value: 'MEX', text: 'Mexico' },
	];

	constructor(private store: Store, private formBuilder: FormBuilder) {}

	ngOnInit(): void {
		this.todoForm = this.formBuilder.group({
			email: ['', [Validators.required, Validators.email]],
			country: ['', [Validators.required]],
			userId: [null, [Validators.required, Validators.minLength(10)]],
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
