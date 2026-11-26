// 공동대표 소개 (홈 "연구소 소개"와 섭외용 소개 페이지 /intro 에서 함께 쓴다)

export interface Founder {
    name: string;
    photo: string;
    photoClass: string;
    bio: string;
    history: string[];
}

export const FOUNDERS: Founder[] = [
    {
        name: '김태주 공동대표',
        photo: '/images/founder_kim.jpg',
        photoClass: 'img-kim',
        bio: '"혁신적인 디지털 기술이 시대를 이끌어가는 가운데, 누구도 소외받지 않고 새로운 미래를 준비할 수 있도록 따뜻한 기술과 통찰력을 제공하는 한국AI연구소가 되겠습니다."',
        history: [
            '성결대학교 신학과',
            '서울신학대학교 대학원',
            '현) 한국AI연구소 공동대표',
            '현) 온교회 담임목사',
            '다수의 IT 솔루션 기획 및 AI 비즈니스 컨설팅 수행',
            '세컨드 브레인을 위한 옵시디언 강의 전문',
        ],
    },
    {
        name: '이광복 공동대표',
        photo: '/images/founder_lee.png',
        photoClass: 'img-lee',
        bio: '"기술은 결국 사람을 향해야 하며, 그 변화의 시작은 끊임없는 배움과 열정에서 시작된다고 믿습니다. 지속 가능한 성장을 꿈꾸는 모든 파트너와 함께 가치를 실현하겠습니다."',
        history: [
            '서울신학대학교 신학과',
            '서울신학대학교 신학대학원',
            '현) 한국AI연구소 공동대표',
            '현) 로스터리 카페 라온트리 대표',
            '현) 라온동행교회 담임목사',
            '직업별 AI 맞춤 컨설팅 및 강의 전문',
        ],
    },
];
