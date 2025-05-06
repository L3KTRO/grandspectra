// media-content-base.component.ts
import {computed, Directive, inject, Input, ResourceRef, Signal, signal} from '@angular/core';
import {BackendService} from './services/backend/backend.service';
import {OccupationEnum} from './models/Occupation';
import {Tv} from './models/Tv';
import {Movie} from './models/Movie';

@Directive()
export abstract class MediaContentBaseComponent {
    @Input() id!: string;
    backend = inject(BackendService);

    isCast = signal(true);

    // Cada componente hijo debe implementar esto
    abstract mediaContent: ResourceRef<(Movie | Tv)>;

    readonly() {
        return this.mediaContent.asReadonly().value()
    };

    // Método abstracto que debe ser implementado por las clases hijas
    abstract getApiEndpoint(): string;

    poster(path: string | null) {
        if (!path) return "https://placehold.co/75x100";
        return path.replace("original", "w780");
    }

    // Métodos que pueden ser sobrescritos por las clases hijas si es necesario

    cast = computed(() => {
        return this.readonly().credits.filter(c => c.occupation_id === OccupationEnum.Actor.valueOf())
            .sort((a, b) => b.person.popularity - a.person.popularity);
    });

    crew = computed(() => {
        return this.readonly().credits.filter(c => c.occupation_id !== OccupationEnum.Actor.valueOf())
            .sort((a, b) => b.person.popularity - a.person.popularity);
    });

    director = computed(() => {
        return this.crew().filter(c => c.occupation_id === OccupationEnum.Director.valueOf())
            .sort((a, b) => b.person.popularity - a.person.popularity)[0];
    });

    genres() {
        return this.readonly().genres.map(g => g.name).join(", ");
    }

    companies() {
        return this.readonly().companies.map(g => g.name).join(", ");
    }

    recommendations() {
        return this.readonly().recommendations.map(r => r);
    }

    // Métodos abstractos que deben ser implementados por las clases hijas
    abstract year: Signal<string | null>;

}
