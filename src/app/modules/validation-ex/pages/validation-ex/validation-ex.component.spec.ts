import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationExComponent } from './validation-ex.component';

describe('ValidationExComponent', () => {
	let component: ValidationExComponent;
	let fixture: ComponentFixture<ValidationExComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ValidationExComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ValidationExComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
