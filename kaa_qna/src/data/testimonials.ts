// 참가자 한마디 (이름 없이 싣는다)
// 출처: 라오스 선교사 AI 집중 교육 설문 원문 (/data/laos_feedback.html)

export interface Testimonial {
    quote: string;
    who: string;
}

export const TESTIMONIALS: Testimonial[] = [
    {
        quote: 'AI 교육은 어렵다는 막연한 생각을 했어요. 하지만 실제로 해보니 "나도 할 수 있겠는데"라고 바뀌었어요.',
        who: '라오스 선교사 AI 집중 교육 참가자',
    },
    {
        quote: 'AI에 대한 막연한 두려움이 있었는데, 비서처럼 활용할 수 있겠다는 적극적인 생각으로 바뀌었습니다.',
        who: '라오스 선교사 AI 집중 교육 참가자',
    },
    {
        quote: '자세한 설명과 친절한 가르침 덕분에 어렵게 생각했던 새로운 분야에 흥미를 갖게 되었습니다.',
        who: '라오스 선교사 AI 집중 교육 참가자',
    },
    {
        quote: '생각해 두었던 아이디어를 홈페이지로 만들어 볼 수 있어 기뻤습니다.',
        who: '라오스 선교사 AI 집중 교육 참가자',
    },
];
