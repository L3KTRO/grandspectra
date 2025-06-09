import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  Component, computed, DoCheck, Input, OnChanges,
  OnDestroy,
  OnInit, Signal, SimpleChanges
} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {ListsVisualizerComponent} from '../../shared/lists-visualizer/lists-visualizer.component';
import {computedResource} from '../../helpers/Resources';
import {BackendService} from '../../services/backend/backend.service';
import {ContentList} from '../../models/ContentList';
import {Content} from '../../models/Content';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {Me} from '../../models/Me';

@Component({
  selector: 'app-lists',
  imports: [
    NgForOf,
    ListsVisualizerComponent,
    RouterLink,
    NgIf
  ],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.scss'
})
export class ListsComponent {

  constructor(private backend: BackendService) {
  }

  lists = computedResource<ContentList[]>({
    loader: async () => (await this.backend.lists()).data
  })

  meResource: Signal<boolean> = computedResource({
    loader: async () => (await this.backend.getMe()).status === 200
  });

  popularities = computed(() => {
    return this.lists()
      .map(list => {
        let count = 0;
        const summatory = (item: Content) => {
          count += parseInt(`${item.popularity ?? 0}`)
        }
        list.movie.forEach(summatory)
        list.tv.forEach(summatory)
        return {
          list,
          popularity: count / (list.movie.length + list.tv.length)
        }
      })
      .sort((a, b) => b.popularity - a.popularity)
      .map(item => item.list);
  });

  voteCounting = computed(() => {
    return this.lists()
      .sort((a, b) => b.votes.length - a.votes.length);
  });

  bestVoted = computed(() => {
    return this.lists()
      .map(list => {
        let count = 0;

        list.votes.forEach(vote => {
          count += vote.vote === 1 ? 1 : -1
        })

        return {
          list,
          totalVotes: count / (list.movie.length + list.tv.length)
        }
      })
      .sort((a, b) => b.totalVotes - a.totalVotes)
      .map(item => item.list);
  });

}
