import { LunchCategory, Restaurant } from '../types';

export const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: '1',
    name: '김밥천국',
    description: '신선한 재료로 만든 정통 김밥',
    imageUrl: 'https://picsum.photos/300/200?random=1',
    rating: 4.2,
    address: '서울시 강남구 역삼동',
    category: 'korean'
  },
  {
    id: '2',
    name: '맘스터치',
    description: '바삭한 치킨과 사이드 메뉴',
    imageUrl: 'https://picsum.photos/300/200?random=2',
    rating: 4.0,
    address: '서울시 강남구 역삼동',
    category: 'western'
  },
  {
    id: '3',
    name: '스타벅스',
    description: '프리미엄 커피와 디저트',
    imageUrl: 'https://picsum.photos/300/200?random=3',
    rating: 4.3,
    address: '서울시 강남구 역삼동',
    category: 'dessert'
  },
  {
    id: '4',
    name: '파리바게뜨',
    description: '갓 구운 빵과 케이크',
    imageUrl: 'https://picsum.photos/300/200?random=4',
    rating: 4.1,
    address: '서울시 강남구 역삼동',
    category: 'dessert'
  },
  {
    id: '5',
    name: '설빙',
    description: '시원한 빙수와 디저트',
    imageUrl: 'https://picsum.photos/300/200?random=5',
    rating: 4.4,
    address: '서울시 강남구 역삼동',
    category: 'dessert'
  },
  {
    id: '6',
    name: '토끼정',
    description: '정갈한 한정식',
    imageUrl: 'https://picsum.photos/300/200?random=6',
    rating: 4.5,
    address: '서울시 강남구 역삼동',
    category: 'korean'
  }
];

export const generateMockVotes = (restaurantIds: string[]): Record<string, number> => {
  const mockVotes: Record<string, number> = {};
  restaurantIds.forEach(id => {
    mockVotes[id] = Math.floor(Math.random() * 10) + 1; // 1-10 랜덤 투표
  });
  return mockVotes;
};

export const ALL_CATEGORIES: LunchCategory[] = [
  'korean',
  'japanese',
  'chinese',
  'western',
  'dessert',
  'etc',
];