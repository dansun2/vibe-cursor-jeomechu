import { LunchCategory, Restaurant } from '../types';

export const CATEGORY_LABELS: Record<LunchCategory, string> = {
  korean: '한식',
  japanese: '일식',
  chinese: '중식',
  western: '양식',
  dessert: '디저트',
  etc: '기타',
};

export const getCategoryLabel = (category: LunchCategory): string => CATEGORY_LABELS[category] ?? category;

export const MOCK_RESTAURANTS: Restaurant[] = [
  // 한식
  { id: 'k-1', name: '김밥천국', description: '신선한 재료의 정통 김밥', imageUrl: 'https://picsum.photos/300/200?random=1', rating: 4.2, address: '서울 강남구 역삼동', category: 'korean' },
  { id: 'k-2', name: '토끼정', description: '정갈한 한정식과 가정식', imageUrl: 'https://picsum.photos/300/200?random=2', rating: 4.5, address: '서울 강남구 선릉로', category: 'korean' },
  { id: 'k-3', name: '백반나라', description: '든든한 집밥 백반', imageUrl: 'https://picsum.photos/300/200?random=3', rating: 4.1, address: '서울 강남구 테헤란로', category: 'korean' },
  { id: 'k-4', name: '부대골', description: '칼칼한 부대찌개 전문', imageUrl: 'https://picsum.photos/300/200?random=4', rating: 4.0, address: '서울 강남구 논현로', category: 'korean' },
  { id: 'k-5', name: '돼지상회', description: '숯불 제육볶음', imageUrl: 'https://picsum.photos/300/200?random=5', rating: 4.3, address: '서울 강남구 학동로', category: 'korean' },
  { id: 'k-6', name: '쌈밥정원', description: '신선한 채소 쌈밥', imageUrl: 'https://picsum.photos/300/200?random=6', rating: 4.2, address: '서울 강남구 봉은사로', category: 'korean' },
  { id: 'k-7', name: '설렁탕집', description: '깊고 진한 국물', imageUrl: 'https://picsum.photos/300/200?random=7', rating: 4.1, address: '서울 강남구 영동대로', category: 'korean' },

  // 일식
  { id: 'j-1', name: '스시한상', description: '정통 스시와 사시미', imageUrl: 'https://picsum.photos/300/200?random=11', rating: 4.4, address: '서울 강남구 선릉로', category: 'japanese' },
  { id: 'j-2', name: '우동야', description: '쫄깃한 우동 전문', imageUrl: 'https://picsum.photos/300/200?random=12', rating: 4.0, address: '서울 강남구 도산대로', category: 'japanese' },
  { id: 'j-3', name: '규카츠명가', description: '바삭한 규카츠', imageUrl: 'https://picsum.photos/300/200?random=13', rating: 4.2, address: '서울 강남구 테헤란로', category: 'japanese' },
  { id: 'j-4', name: '돈카츠정', description: '수제 등심 돈카츠', imageUrl: 'https://picsum.photos/300/200?random=14', rating: 4.1, address: '서울 강남구 학동로', category: 'japanese' },
  { id: 'j-5', name: '라멘야스', description: '진한 돈코츠 라멘', imageUrl: 'https://picsum.photos/300/200?random=15', rating: 4.3, address: '서울 강남구 봉은사로', category: 'japanese' },
  { id: 'j-6', name: '사케동집', description: '연어 사케동 전문', imageUrl: 'https://picsum.photos/300/200?random=16', rating: 4.2, address: '서울 강남구 영동대로', category: 'japanese' },
  { id: 'j-7', name: '카레야', description: '향신 가득 일본식 카레', imageUrl: 'https://picsum.photos/300/200?random=17', rating: 4.0, address: '서울 강남구 압구정로', category: 'japanese' },

  // 중식
  { id: 'c-1', name: '홍반장', description: '매콤한 짬뽕과 탕수육', imageUrl: 'https://picsum.photos/300/200?random=21', rating: 4.1, address: '서울 강남구 도산대로', category: 'chinese' },
  { id: 'c-2', name: '황제짜장', description: '직접 반죽한 짜장면', imageUrl: 'https://picsum.photos/300/200?random=22', rating: 4.0, address: '서울 강남구 테헤란로', category: 'chinese' },
  { id: 'c-3', name: '삼천리반점', description: '오래된 전통의 중화요리', imageUrl: 'https://picsum.photos/300/200?random=23', rating: 4.2, address: '서울 강남구 학동로', category: 'chinese' },
  { id: 'c-4', name: '마라공방', description: '얼얼한 마라탕/마라샹궈', imageUrl: 'https://picsum.photos/300/200?random=24', rating: 4.3, address: '서울 강남구 봉은사로', category: 'chinese' },
  { id: 'c-5', name: '꿔바로우집', description: '새콤달콤 찹쌀 탕수육', imageUrl: 'https://picsum.photos/300/200?random=25', rating: 4.1, address: '서울 강남구 영동대로', category: 'chinese' },
  { id: 'c-6', name: '딤섬팩토리', description: '수제 딤섬 전문', imageUrl: 'https://picsum.photos/300/200?random=26', rating: 4.2, address: '서울 강남구 선릉로', category: 'chinese' },
  { id: 'c-7', name: '사천성관', description: '사천식 마라요리', imageUrl: 'https://picsum.photos/300/200?random=27', rating: 4.0, address: '서울 강남구 논현로', category: 'chinese' },

  // 양식
  { id: 'w-1', name: '버거클럽', description: '수제 치즈버거', imageUrl: 'https://picsum.photos/300/200?random=31', rating: 4.2, address: '서울 강남구 테헤란로', category: 'western' },
  { id: 'w-2', name: '맘스터치', description: '바삭한 치킨과 사이드', imageUrl: 'https://picsum.photos/300/200?random=32', rating: 4.0, address: '서울 강남구 역삼동', category: 'western' },
  { id: 'w-3', name: '파스타리아', description: '알단테 이탈리안 파스타', imageUrl: 'https://picsum.photos/300/200?random=33', rating: 4.3, address: '서울 강남구 선릉로', category: 'western' },
  { id: 'w-4', name: '스테이크룸', description: '웻에이징 스테이크', imageUrl: 'https://picsum.photos/300/200?random=34', rating: 4.4, address: '서울 강남구 도산대로', category: 'western' },
  { id: 'w-5', name: '피자리코', description: '화덕 피자 전문', imageUrl: 'https://picsum.photos/300/200?random=35', rating: 4.1, address: '서울 강남구 학동로', category: 'western' },
  { id: 'w-6', name: '샐러드보울', description: '건강한 샐러드 플레이트', imageUrl: 'https://picsum.photos/300/200?random=36', rating: 4.0, address: '서울 강남구 봉은사로', category: 'western' },
  { id: 'w-7', name: '멕시칸그릴', description: '부리또/타코 전문', imageUrl: 'https://picsum.photos/300/200?random=37', rating: 4.1, address: '서울 강남구 영동대로', category: 'western' },

  // 디저트
  { id: 'd-1', name: '스타벅스', description: '프리미엄 커피와 디저트', imageUrl: 'https://picsum.photos/300/200?random=41', rating: 4.3, address: '서울 강남구 역삼동', category: 'dessert' },
  { id: 'd-2', name: '파리바게뜨', description: '갓 구운 빵과 케이크', imageUrl: 'https://picsum.photos/300/200?random=42', rating: 4.1, address: '서울 강남구 역삼동', category: 'dessert' },
  { id: 'd-3', name: '설빙', description: '시원한 빙수와 디저트', imageUrl: 'https://picsum.photos/300/200?random=43', rating: 4.4, address: '서울 강남구 도산대로', category: 'dessert' },
  { id: 'd-4', name: '베스킨라빈스', description: '아이스크림 스페셜', imageUrl: 'https://picsum.photos/300/200?random=44', rating: 4.0, address: '서울 강남구 테헤란로', category: 'dessert' },
  { id: 'd-5', name: '할리스커피', description: '부드러운 라떼와 디저트', imageUrl: 'https://picsum.photos/300/200?random=45', rating: 4.0, address: '서울 강남구 학동로', category: 'dessert' },
  { id: 'd-6', name: '뚜레쥬르', description: '다양한 베이커리', imageUrl: 'https://picsum.photos/300/200?random=46', rating: 4.1, address: '서울 강남구 봉은사로', category: 'dessert' },
  { id: 'd-7', name: '앤티앤스', description: '프레첼 전문', imageUrl: 'https://picsum.photos/300/200?random=47', rating: 3.9, address: '서울 강남구 영동대로', category: 'dessert' },

  // 기타
  { id: 'e-1', name: '분식타임', description: '떡볶이/튀김/순대', imageUrl: 'https://picsum.photos/300/200?random=51', rating: 4.0, address: '서울 강남구 도산대로', category: 'etc' },
  { id: 'e-2', name: '샌드랩', description: '가벼운 샌드위치', imageUrl: 'https://picsum.photos/300/200?random=52', rating: 3.9, address: '서울 강남구 선릉로', category: 'etc' },
  { id: 'e-3', name: '헬시볼', description: '그레인볼 & 포케', imageUrl: 'https://picsum.photos/300/200?random=53', rating: 4.1, address: '서울 강남구 테헤란로', category: 'etc' },
  { id: 'e-4', name: '도시락연구소', description: '정성 가득 도시락', imageUrl: 'https://picsum.photos/300/200?random=54', rating: 4.0, address: '서울 강남구 학동로', category: 'etc' },
  { id: 'e-5', name: '국밥천국', description: '든든한 국밥 한 그릇', imageUrl: 'https://picsum.photos/300/200?random=55', rating: 4.2, address: '서울 강남구 봉은사로', category: 'etc' },
  { id: 'e-6', name: '면요리연합', description: '아시아 누들 셀렉션', imageUrl: 'https://picsum.photos/300/200?random=56', rating: 4.0, address: '서울 강남구 영동대로', category: 'etc' },
  { id: 'e-7', name: '키친랩', description: '퓨전 창작요리', imageUrl: 'https://picsum.photos/300/200?random=57', rating: 4.1, address: '서울 강남구 압구정로', category: 'etc' },
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
  // 'dessert' 제외
  'etc',
];