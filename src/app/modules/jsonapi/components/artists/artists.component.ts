import { Component } from '@angular/core';
import { ArtistsService } from '@app/modules/jsonapi/services/artists.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'app-artists',
	templateUrl: './artists.component.html',
	styleUrls: ['./artists.component.scss'],
})
export class ArtistsComponent {
	artistForm: FormGroup;

	public artists$ = this.artistsService.getAllModels();

	constructor(private fb: FormBuilder, private readonly artistsService: ArtistsService) {
		this.artistForm = this.fb.group({
			id: [''],
			name: ['', Validators.required],
		});
	}

	onSubmit() {
		this.artistsService.createAndSave(this.artistForm.value).subscribe((resp) => {
			this.artists$ = this.artistsService.getAllModels();
			this.artistForm.reset();
		});
	}
}
