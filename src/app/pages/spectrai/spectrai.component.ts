// spectrai-chatbot.component.ts
import {AfterViewChecked, Component, computed, effect, ElementRef, OnInit, signal, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {CommonModule} from '@angular/common';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  options?: string[];
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
    CommonModule
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

  // Computed properties
  progressPercentage = computed(() => {
    return Math.round((this.questionStep() / this.totalSteps()) * 100);
  });

  constructor() {
    // Inicializar conversación al cargar
    effect(() => {
      if (this.messages().length === 0) {
        this.startConversation();
      }
    });
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
      content: '¡Hola! 🎬 Soy SpectrAI, tu asistente personal de recomendaciones cinematográficas. Te haré algunas preguntas para conocer mejor tus gustos y encontrar contenido perfecto para ti.',
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
        question: '¿Cómo te sientes hoy? Esto me ayudará a recomendarte el tono perfecto.',
        type: 'single',
        options: ['Quiero algo emocionante', 'Necesito relajarme', 'Busco inspiración', 'Quiero reír', 'Algo nostálgico']
      },
      {
        id: 2,
        question: '¿Qué géneros te llaman más la atención? (Puedes elegir hasta 3)',
        type: 'multiple',
        options: ['Acción', 'Drama', 'Comedia', 'Sci-Fi', 'Terror', 'Romance', 'Thriller', 'Fantasía', 'Documental']
      },
      {
        id: 3,
        question: '¿Cuánto tiempo tienes disponible para ver contenido?',
        type: 'single',
        options: ['1-2 horas (película corta)', '2-3 horas (película larga)', 'Serie de episodios cortos', 'Serie para maratonear', 'No tengo preferencia']
      },
      {
        id: 4,
        question: '¿Qué época de contenido prefieres?',
        type: 'single',
        options: ['Muy reciente (2023-2025)', 'Moderna (2010-2022)', 'Nostálgica (2000-2009)', 'Clásica (1990-1999)', 'Vintage (antes 1990)']
      },
      {
        id: 5,
        question: '¿Qué tipo de popularidad buscas?',
        type: 'single',
        options: ['Grandes éxitos mainstream', 'Joyas ocultas poco conocidas', 'Aclamado por la crítica', 'Trending en redes sociales', 'Clásicos atemporales']
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

    this.messages.update(msgs => [...msgs, userMessage]);

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
        content: '¡Perfecto! 🎯 Estoy analizando tus preferencias para encontrar las mejores recomendaciones. Dame un momento...',
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
    const recommendationsMessage: ChatMessage = {
      id: this.generateMessageId(),
      type: 'bot',
      content: '🎬 ¡Increíble! He encontrado contenido perfecto basado en usuarios con gustos similares. ¿Te gustaría ver las recomendaciones?',
      timestamp: new Date(),
      options: ['Ver recomendaciones', 'Guardar en lista privada', 'Empezar nueva búsqueda']
    };

    this.messages.update(msgs => [...msgs, recommendationsMessage]);
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
