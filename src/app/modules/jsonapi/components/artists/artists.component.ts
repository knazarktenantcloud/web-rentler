import { Component } from '@angular/core';
import { ArtistsService } from '@app/modules/jsonapi/services/artists.service';

@Component({
	selector: 'app-artists',
	templateUrl: './artists.component.html',
	styleUrls: ['./artists.component.scss'],
})
export class ArtistsComponent {
	public artists$ = this.artistsService.getAllModels();

	constructor(private readonly artistsService: ArtistsService) {}
}
