import {
  Component,
  computed,
  effect, HostListener,
  inject,
  Input, OnDestroy,
  OnInit,
  resource,
  ResourceRef,
  signal,
  Signal,
  ViewChild
} from '@angular/core';
import {NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {BackendService} from "../../services/backend/backend.service";
import {ContentlistComponent} from '../../shared/contentlist/contentlist.component';
import {Movie} from '../../models/Movie';
import {Tv} from '../../models/Tv';
import {UserAndContent} from '../../models/UserAndContent';
import {SyncStore} from '../../stores/SyncStore';
import {ListsVisualizerComponent} from '../../shared/lists-visualizer/lists-visualizer.component';
import {Me} from '../../models/Me';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogComponent} from '../../shared/dialog/dialog.component';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ProgressSpinnerComponent} from '../../shared/progress-spinner/progress-spinner.component';
import {toggler} from '../../helpers/Toggler';
import {RequestResendVerification} from '../../stores/RequestResendVerification';
import {CropperPosition, ImageCroppedEvent, ImageCropperComponent, LoadedImage} from 'ngx-image-cropper';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  imports: [
    NgOptimizedImage,
    NgIf,
    ContentlistComponent,
    NgForOf,
    ListsVisualizerComponent,
    DialogComponent,
    ReactiveFormsModule,
    ProgressSpinnerComponent,
    ImageCropperComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit, OnDestroy {
  @Input() username!: string;
  @ViewChild("edit") editDialog!: DialogComponent;

  usernamePath = signal(this.username);
  editForm: FormGroup;
  showPassword = signal(false);
  isLoading = signal(false);
  editError = signal([""]);
  isLoadingResend = signal(false);
  avatar = signal(null)

  constructor(
    public syncStore: SyncStore,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public requestResendVerification: RequestResendVerification,
    private sanitizer: DomSanitizer
  ) {
    this.initialSync.set(syncStore.profileSync())
    effect(() => {
      if (this.syncStore.profileSync() > this.initialSync()) {
        this.triggerSync.update(res => res + 1);
      }
    });

    effect(() => {
      if (this.cropping() && this.cropped === null) {
        this.isLoading.set(true)
        const interval = setInterval(() => {
          console.log("interval")
          if (this.cropped !== null) {
            this.isLoading.set(false)
            clearInterval(interval);
          }
        }, 100);
      }
    });

    this.editForm = this.fb.group({
      email: ["", [Validators.email]],
      username: ["", [Validators.minLength(5), Validators.pattern('^[a-z0-9]+$'), Validators.maxLength(20)]],
      password: ["", [Validators.minLength(8)]],
      password_confirmation: ["", [(control: {
        parent: { get: (arg0: string) => { (): any; new(): any; value: any; }; };
        value: any;
      }) => control.parent && control.value !== control.parent.get('password')?.value ? {notMatching: true} : null]],
    });
  }

  windowWidth = signal(typeof window !== 'undefined' ? window.innerWidth : 1024);

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const target = event.target as Window;
    this.windowWidth.set(target.innerWidth);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.onResize);
  }

  ngOnInit() {
    this.windowWidth.set(window.innerWidth);
    this.route.paramMap.subscribe(data => {
      this.usernamePath.set(data.get("username") || '')
      this.userResource.reload();
    });
  }

  initialSync = signal(0)
  triggerSync = signal(0)
  backend = inject(BackendService);
  router = inject(Router);

  meResource: ResourceRef<Me> = resource(({
    loader: async () => {
      const req = await this.backend.getMe()
      this.editForm.setValue({
        username: req.data.username,
        email: req.data.email,
        password: '',
        password_confirmation: ''
      });
      return req.status === 200 ? req.data : null
    }
  }))

  me = computed(() => this.meResource.asReadonly().value());

  meFollowing = computed(() => this.me().following.map(u => u.username))

  userResource = resource({
    request: () => ({
      sync: this.triggerSync(),
      username: this.usernamePath(),
    }),
    loader: async ({request}) => {
      const req = await this.backend.getUser(request.username);
      if (req.status === 200) {
        return req.data;
      } else {
        return this.router.navigate(['/spectators']);
      }
    }
  });

  user = computed(() => this.userResource.asReadonly().value());

  moviesLength = computed(() => {
    const allContent = [
      ...this.user()?.watched || [],
      ...this.user()?.watchlist || [],
      ...this.user()?.ratings || []
    ];
    return Array.from(new Set(allContent.filter(film => film.movie_id !== null).map(film => film.movie_id))).length;
  });

  tvLength = computed(() => {
    const allContent = [
      ...this.user()?.watched || [],
      ...this.user()?.watchlist || [],
      ...this.user()?.ratings || []
    ];
    return Array.from(new Set(allContent.filter(film => film.tv_id !== null).map(film => film.tv_id))).length;
  });

  watched: Signal<(Movie | Tv)[]> = computed(() => this.user().watched.sort(this.sorter).map(this.mapper));
  watchlist: Signal<(Movie | Tv)[]> = computed(() => this.user().watchlist.sort(this.sorter).map(this.mapper));
  ratings: Signal<(Movie | Tv)[]> = computed(() => this.user().ratings.sort(this.sorter).map(this.mapper));

  sorter(a: UserAndContent, b: UserAndContent) {
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  }

  mapper(r: UserAndContent) {
    return r.movie_id ? r.movie! : r.tv!;
  }

  logout() {
    this.backend.logout();
    location.reload();
  }

  follow() {
    this.backend.follow(this.user().username).then(res => {
      if (res.status === 201) {
        this.meResource.reload();
      }
    });
  }

  unfollow() {
    this.backend.unfollow(this.user().username).then(res => {
      if (res.status === 204) {
        this.meResource.reload();
      }
    });
  }

  resendVerification() {
    this.isLoadingResend.set(true)
    this.backend.resendVerification().then(res => {
      if (res.status === 200) {
        this.requestResendVerification.addDelay()
        this.editError.set(["Verification email sent successfully."]);
      } else {
        this.editError.set(["Failed to send verification email."]);
      }
      this.isLoadingResend.set(false)
    });
  }

  togglePasswordVisibility() {
    this.showPassword.update(toggler)
  }

  onSubmit() {
    if (this.editForm.valid) {
      this.isLoading.set(true)
      this.backend.editProfile({
        ...this.editForm.value,
        avatar: this.cropped ?? null
      }).then(res => {
        if (res.status === 200) {
          this.syncStore.addChangeLogin();
          this.meResource.reload();
          this.editDialog.close();
          this.triggerSync.update(res => res + 1);
          this.router.navigate(['/spectator/' + this.me().username]);
          this.isLoading.set(false)
        } else {
          this.editError.set([res.data.message]);
        }
        this.isLoading.set(false);
      }).catch(err => {
        console.log(err.status)
        if (err.status === 413) {
          this.editError.set(["Image too large, please upload a smaller image."]);
        }
        this.isLoading.set(false);
      })
    } else {
      this.editForm.markAllAsTouched();
    }
  }

  imageChangedEvent: Event | null = null;
  croppedImage: SafeUrl = '';
  cropped: Blob | null = null;
  cropping = signal(false);

  @ViewChild("cropperDialog") cropperDialog!: DialogComponent;
  @ViewChild(ImageCropperComponent) imageCropper!: ImageCropperComponent;


  fileChangeEvent(event: Event): void {
    console.log("change")
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.cropping.set(true)
    if (event.objectUrl != null) {
      this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);
    }
  }

  imageLoaded(image: LoadedImage) {
    this.cropperDialog.open();
  }

  cropperReady() {
    console.log("cropper ready");
  }

  cropperChange(event: CropperPosition) {
    console.log("change")
  }

  loadImageFailed() {
    this.cropperDialog.close();
  }

  cropImage() {
    this.imageCropper.crop("blob")?.then(res => {
      this.cropped = res.blob ?? null
    });
    this.cropperDialog.close();
  }

  fileUploadWaiting() {
    console.log("waiting for file upload");
  }

  protected readonly Math = Math;
  protected readonly Date = Date;
}
