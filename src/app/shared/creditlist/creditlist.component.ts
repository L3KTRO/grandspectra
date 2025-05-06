import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {Skeleton} from 'primeng/skeleton';
import Credit from '../../models/Credit';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-creditlist',
  imports: [
    NgIf,
    NgForOf,
    Skeleton,
    NgOptimizedImage,
    RouterLink
  ],
  templateUrl: './creditlist.component.html',
  styleUrl: './creditlist.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreditlistComponent {
  @Input({required: true}) content: Credit[] = [];
  @Input() title: string = '';
  @Input() sizes: {
    width: number;
    height: number;
  } = {width: 150, height: 225};

  intrinsic(poster: string | null) {
    if (!poster) return `https://placehold.co/${this.sizes.width}x${this.sizes.height}`
    return poster.replace('original', `w300`);
  }

  groupCreditsByPerson() {
    const grouped = new Map<number, { person: Credit['person']; roles: string[]; character: boolean }>();

    this.content.forEach((credit) => {
      const personId = credit.person.id;
      if (!grouped.has(personId)) {
        grouped.set(personId, {person: credit.person, roles: [], character: false});
      }
      const roles = grouped.get(personId)!.roles;
      if (credit.character) {
        roles.push(`${credit.character}`);
      } else if (credit.occupation) {
        roles.push(`${credit.occupation.name}`);
      }
    });

    return Array.from(grouped.values());
  }

  protected readonly Array = Array;
}
