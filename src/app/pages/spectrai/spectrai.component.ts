// spectrai-chatbot.component.ts
import {
  AfterViewChecked,
  Component,
  computed,
  ElementRef,
  OnInit,
  signal,
  ViewChild,
  WritableSignal
} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {CommonModule} from '@angular/common';
import {IntelligenceService} from '../../services/intelligence/intelligence.service';
import {IntelligenceRecommendation} from '../../models/IntelligenceRecommendation';
import {BackendService} from '../../services/backend/backend.service';
import {Movie} from '../../models/Movie';
import {Tv} from '../../models/Tv';
import {ContentlistWrapComponent} from '../../shared/contentlistwrap/contentlistwrap.component';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  options?: string[];
  showMatched?: boolean; // Indica si se deben mostrar las coincidencias
}

interface ChatQuestion {
  id: number;
  question: string;
  type: 'single' | 'multiple';
  options: string[];
}

@Component({
  selector: 'app-spectrai',
  standalone: true,
  imports: [
    CommonModule,
    ContentlistWrapComponent,
  ],
  templateUrl: './spectrai.component.html',
  styleUrls: ['./spectrai.component.scss'],
  animations: [
    trigger('messageSlide', [
      transition(':enter', [
        style({opacity: 0, transform: 'translateY(20px)'}),
        animate('300ms ease-out', style({opacity: 1, transform: 'translateY(0)'}))
      ])
    ]),
    trigger('typingIndicator', [
      transition(':enter', [
        style({opacity: 0, scale: 0.8}),
        animate('200ms ease-out', style({opacity: 1, scale: 1}))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({opacity: 0, scale: 0.8}))
      ])
    ]),
    trigger('optionHover', [
      state('default', style({transform: 'translateY(0)', boxShadow: 'none'})),
      state('hovered', style({
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
      })),
      transition('default <=> hovered', animate('200ms ease-out'))
    ]),
    trigger('progressAnimation', [
      transition('* => *', [
        animate('500ms ease-out')
      ])
    ])
  ]
})
export class SpectraiComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  // Signals para estado reactivo
  messages = signal<ChatMessage[]>([]);
  currentQuestion = signal<ChatQuestion | null>(null);
  conversationId = signal<string>('');
  isTyping = signal<boolean>(false);
  chatError = signal<string>('');
  questionStep = signal<number>(0);
  totalSteps = signal<number>(5);
  hoveredOption = signal<string>('');
  responses = signal<string[]>([]);
  matched: WritableSignal<(Movie | Tv)[]> = signal([])


  // Computed properties
  progressPercentage = computed(() => {
    return Math.round((this.questionStep() / this.totalSteps()) * 100);
  });

  constructor(protected intelligenceService: IntelligenceService, protected backend: BackendService) {
  }

  ngOnInit(): void {
    this.addWelcomeMessage();
    const main = document.querySelector('main');
    main?.scrollIntoView({behavior: 'smooth'});
  }

  ngAfterViewChecked(): void {
    //this.scrollToBottom();
  }

  // Métodos principales
  addWelcomeMessage(): void {
    const welcomeMessage: ChatMessage = {
      id: this.generateMessageId(),
      type: 'bot',
      content: 'Hello! 🎬 I\'m SpectrAI, your personal movie and tv shows recommendation assistant. I\'ll ask you a few questions to better understand your tastes and find the perfect content for you.',
      timestamp: new Date()
    };

    this.messages.update(msgs => [...msgs, welcomeMessage]);

    setTimeout(() => {
      this.startQuestionFlow();
    }, 1500);
    this.scrollToBottom()
  }

  startConversation(): void {
    this.messages.set([]);
    this.questionStep.set(0);
    this.chatError.set('');
    this.conversationId.set(this.generateConversationId());
    this.addWelcomeMessage();
  }

  startQuestionFlow(): void {
    this.isTyping.set(true);

    setTimeout(() => {
      this.isTyping.set(false);
      this.askNextQuestion();
    }, 1000);
  }

  askNextQuestion(): void {
    const questions: ChatQuestion[] = [
      {
        id: 1,
        question: 'How are you feeling today? This will help me recommend the perfect content for you.',
        type: 'single',
        options: ['I want something exciting', 'I need to relax', 'Looking for inspiration', 'I want to laugh']
      },
      {
        id: 2,
        question: 'What genre appeals to you the most?',
        type: 'multiple',
        options: ['Action', 'Drama', 'Comedy', 'Sci-Fi', 'Horror', 'Romance', 'Thriller', 'Fantasy', 'Kids']
      },
      {
        id: 3,
        question: 'How much time do you have available to watch content?',
        type: 'single',
        options: ['1-2 hours (short movie)', '2-3 hours (long movie)', 'Series with short episodes', 'Series to binge-watch']
      },
      {
        id: 4,
        question: 'What era of content do you prefer?',
        type: 'single',
        options: ['Very recent (2023-2025)', 'Modern (2010-2022)', 'Nostalgic (2000-2009)', 'Classic (1990-1999)', 'Vintage (before 1990)']
      },
      {
        id: 5,
        question: 'What type of popularity are you looking for?',
        type: 'single',
        options: ['Mainstream blockbusters', 'Hidden gems little known', 'Critically acclaimed']
      }
    ];

    const currentStep = this.questionStep();

    if (currentStep < questions.length) {
      const question = questions[currentStep];
      this.currentQuestion.set(question);

      const questionMessage: ChatMessage = {
        id: this.generateMessageId(),
        type: 'bot',
        content: question.question,
        timestamp: new Date(),
        options: question.options
      };

      this.messages.update(msgs => [...msgs, questionMessage]);
      this.questionStep.update(step => step + 1);
    } else {
      this.finishConversation();
    }
    this.scrollToBottom()
  }

  selectOption(option: string): void {
    if (!this.canSelectOption(option)) return;

    // Agregar respuesta del usuario
    const userMessage: ChatMessage = {
      id: this.generateMessageId(),
      type: 'user',
      content: option,
      timestamp: new Date()
    };

    this.responses.update(res => [...res, option]);

    this.messages.update(msgs => [...msgs, userMessage]);
    this.scrollToBottom()

    // Simular typing antes de la siguiente pregunta
    this.isTyping.set(true);

    setTimeout(() => {
      this.isTyping.set(false);

      if (this.questionStep() < this.totalSteps()) {
        this.askNextQuestion();
      } else {
        this.finishConversation();
      }
      setTimeout(() => {
        this.scrollToBottom()
      }, 300);
    }, 800);
  }

  finishConversation(): void {
    this.isTyping.set(true);

    setTimeout(() => {
      this.isTyping.set(false);

      const finishMessage: ChatMessage = {
        id: this.generateMessageId(),
        type: 'bot',
        content: `Perfect! 🎯 I'm analyzing your preferences to find the best recommendations. Give me a moment...`,
        timestamp: new Date()
      };

      this.messages.update(msgs => [...msgs, finishMessage]);

      // Simular procesamiento de recomendaciones
      setTimeout(() => {
        this.generateRecommendations();
      }, 2000);
      this.scrollToBottom()
    }, 500);
  }

  generateRecommendations(): void {
    this.intelligenceService.generateRecommendations(this.responses()).then((value: {
      text: string,
      recommendations: IntelligenceRecommendation[],
      sources: any,
      providerMetadata: any
    }) => {
      this.matched.set([]);
      value.recommendations.forEach((recommendation: IntelligenceRecommendation) => {
        if (this.messages().some(msg => msg.type === "user" && msg.content.includes("movie"))) {
          this.backend.getMovies(recommendation.title + ' ' + recommendation.year).then((movies) => {
            const result = movies.data.data.length > 0 ? movies.data.data[0] : null
            if (result) {
              this.matched.update(res => [...res, result]);
            }
          })
        } else {
          this.backend.getTv(recommendation.title + ' ' + recommendation.year).then((tv) => {
            const result = tv.data.data.length > 0 ? tv.data.data[0] : null
            if (result) {
              this.matched.update(res => [...res, result]);
            }
          })
        }
      })

      const recommendationsMessage: ChatMessage = {
        id: this.generateMessageId(),
        type: 'bot',
        content: '🎬 Nice! I found some recommendations:',
        timestamp: new Date(),
        options: ['Find more recommendations'],
        showMatched: true
      };
      this.messages.update(msgs => [...msgs, recommendationsMessage]);
    });
  }

  // Métodos auxiliares
  canSelectOption(option: string): boolean {
    return !this.isTyping() && this.currentQuestion() !== null;
  }

  onOptionHover(option: string): void {
    this.hoveredOption.set(option);
  }

  onOptionLeave(): void {
    this.hoveredOption.set('');
  }

  getOptionState(option: string): string {
    return this.hoveredOption() === option ? 'hovered' : 'default';
  }

  formatTimestamp(timestamp: Date): string {
    return timestamp.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateConversationId(): string {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        const element = this.messagesContainer.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }
}
