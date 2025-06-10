import {Component} from '@angular/core';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-about',
  imports: [
    NgForOf
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  faqItems = [
    {
      question: 'How does the recommendation system work?',
      answer: 'We use artificial intelligence algorithms that analyze your preferences, viewing history, and behavior to suggest personalized content. Our system continuously learns from your interactions to improve recommendations.',
      isOpen: false
    },
    {
      question: 'Is Grand Spectra free to use?',
      answer: 'Yes, Grand Spectra is completely free. You can create your account, follow other users, create lists, and receive recommendations at no cost.',
      isOpen: false
    },
    {
      question: 'How can I follow other users?',
      answer: 'You can search for users by name in the "Spectators" section or discover them through their public lists. Simply click "Follow" on their profile to follow their activities and recommendations.',
      isOpen: false
    },
    {
      question: 'Can I create private lists?',
      answer: 'Absolutely. When creating a list, you can choose whether you want it to be public (visible to everyone) or private (only for you). You can change the privacy of your lists at any time.',
      isOpen: false
    },
    {
      question: 'Where do you get the movie and series information from?',
      answer: 'We use multiple reliable data sources such as The Movie Database (TMDb), OMDb, and other specialized APIs to ensure you have access to complete and up-to-date information.',
      isOpen: false
    },
    {
      question: 'How does the search work?',
      answer: 'Our search engine uses Meilisearch to provide instant and relevant results. You can search by title, actor, director, genre, or even other users on the platform.',
      isOpen: false
    },
    {
      question: 'Can I export my lists?',
      answer: 'We are currently working on export features. In the meantime, all your lists are safe in your profile and you can access them at any time.',
      isOpen: false
    },
    {
      question: 'How do I report a problem or suggest an improvement?',
      answer: 'You can contact us directly at contact@grandspectra.top. We greatly value feedback from our community and work constantly to improve the platform.',
      isOpen: false
    },
    {
      question: 'Does Grand Spectra work on mobile devices?',
      answer: 'Yes, Grand Spectra is fully optimized for mobile devices. You can access all features from your smartphone or tablet with the same smooth experience.',
      isOpen: false
    },
    {
      question: 'Are there limits on the number of lists I can create?',
      answer: 'There are no limits on the number of lists you can create. Organize your content as you prefer: by genre, mood, year, or any criteria that works for you.',
      isOpen: false
    }
  ];

  toggleFaq(index: number) {
    this.faqItems[index].isOpen = !this.faqItems[index].isOpen;
  }
}
