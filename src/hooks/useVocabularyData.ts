
import { useState, useEffect } from 'react';
import { VocabularyWord } from '@/types/vocabulary';

const SAMPLE_VOCABULARY: VocabularyWord[] = [
  {
    id: '1',
    word: 'Serendipity',
    definition: 'The occurrence and development of events by chance in a happy or beneficial way',
    pronunciation: 'ser-ən-ˈdi-pə-tē',
    partOfSpeech: 'noun',
    category: 'Abstract Concepts',
    example: 'Meeting her old friend at the coffee shop was pure serendipity.',
    synonyms: ['chance', 'fortune', 'luck', 'providence'],
    imageUrl: 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=400&h=300&fit=crop'
  },
  {
    id: '2',
    word: 'Ephemeral',
    definition: 'Lasting for a very short time',
    pronunciation: 'ɪˈfem(ə)rəl',
    partOfSpeech: 'adjective',
    category: 'Descriptive',
    example: 'The beauty of cherry blossoms is ephemeral, lasting only a few weeks.',
    synonyms: ['temporary', 'fleeting', 'transient', 'brief'],
    imageUrl: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400&h=300&fit=crop'
  },
  {
    id: '3',
    word: 'Ubiquitous',
    definition: 'Present, appearing, or found everywhere',
    pronunciation: 'yo͞oˈbikwədəs',
    partOfSpeech: 'adjective',
    category: 'Descriptive',
    example: 'Smartphones have become ubiquitous in modern society.',
    synonyms: ['omnipresent', 'pervasive', 'universal', 'widespread'],
    imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop'
  },
  {
    id: '4',
    word: 'Mellifluous',
    definition: 'Sweet or musical; pleasant to hear',
    pronunciation: 'məˈliflo͞oəs',
    partOfSpeech: 'adjective',
    category: 'Sensory',
    example: 'Her mellifluous voice captivated the entire audience.',
    synonyms: ['melodious', 'harmonious', 'sweet-sounding', 'musical'],
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop'
  },
  {
    id: '5',
    word: 'Perspicacious',
    definition: 'Having a ready insight into and understanding of things',
    pronunciation: 'ˌpərspɪˈkeɪʃəs',
    partOfSpeech: 'adjective',
    category: 'Intellectual',
    example: 'The detective\'s perspicacious observations solved the case quickly.',
    synonyms: ['perceptive', 'astute', 'shrewd', 'discerning'],
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'
  },
  {
    id: '6',
    word: 'Quintessential',
    definition: 'Representing the most perfect example of a quality or class',
    pronunciation: 'ˌkwin(t)əˈsen(t)SHəl',
    partOfSpeech: 'adjective',
    category: 'Descriptive',
    example: 'Paris is the quintessential romantic city.',
    synonyms: ['typical', 'archetypal', 'classic', 'ideal'],
    imageUrl: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop'
  },
  {
    id: '7',
    word: 'Cacophony',
    definition: 'A harsh, discordant mixture of sounds',
    pronunciation: 'kəˈkäfənē',
    partOfSpeech: 'noun',
    category: 'Sensory',
    example: 'The construction site created a cacophony of drilling and hammering.',
    synonyms: ['discord', 'din', 'racket', 'clamor'],
    imageUrl: 'https://images.unsplash.com/photo-1415734117253-603b0c3c3b3c?w=400&h=300&fit=crop'
  },
  {
    id: '8',
    word: 'Surreptitious',
    definition: 'Kept secret, especially because it would not be approved of',
    pronunciation: 'ˌsərəpˈtiSHəs',
    partOfSpeech: 'adjective',
    category: 'Behavior',
    example: 'He cast a surreptitious glance at his watch during the meeting.',
    synonyms: ['secretive', 'stealthy', 'furtive', 'covert'],
    imageUrl: 'https://images.unsplash.com/photo-1574192324001-ee41e18ed679?w=400&h=300&fit=crop'
  },
  {
    id: '9',
    word: 'Magnanimous',
    definition: 'Very generous or forgiving, especially toward a rival or less powerful person',
    pronunciation: 'maɡˈnanəməs',
    partOfSpeech: 'adjective',
    category: 'Character',
    example: 'Despite winning, she was magnanimous toward her defeated opponent.',
    synonyms: ['generous', 'charitable', 'benevolent', 'noble'],
    imageUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=300&fit=crop'
  },
  {
    id: '10',
    word: 'Ineffable',
    definition: 'Too great or extreme to be expressed or described in words',
    pronunciation: 'ɪnˈɛfəbəl',
    partOfSpeech: 'adjective',
    category: 'Abstract Concepts',
    example: 'The beauty of the sunset was ineffable, leaving everyone speechless.',
    synonyms: ['indescribable', 'inexpressible', 'unspeakable', 'sublime'],
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
  }
];

export function useVocabularyData() {
  const [vocabularyWords] = useState<VocabularyWord[]>(SAMPLE_VOCABULARY);

  return {
    vocabularyWords
  };
}
