import coursesData from '@/data/courses.json';
import { MATERIALS_BY_ID } from '@/data/curations';
import type { MaterialItem } from '@/types/material';

export interface CourseSection {
    title: string;
    summary: string;
    lessons: { materialId: string }[];
}

export interface Course {
    slug: string;
    title: string;
    subtitle: string;
    audience: string;
    instructors: string;
    icon: string;
    sections: CourseSection[];
}

export interface CourseLesson {
    /** 1부터 시작하는 과정 전체 차시 번호 */
    number: number;
    sectionTitle: string;
    material: MaterialItem;
}

export const COURSES: Course[] = coursesData as Course[];

export function getCourse(slug: string): Course | undefined {
    return COURSES.find((c) => c.slug === slug);
}

/** 과정의 모든 차시를 순서대로 펼친다 (차시 번호는 과정 전체에서 1, 2, 3 …) */
export function getCourseLessons(course: Course): CourseLesson[] {
    let n = 0;
    return course.sections.flatMap((section) =>
        section.lessons.map((l) => {
            const material = MATERIALS_BY_ID[l.materialId];
            if (!material) throw new Error(`강의 ${course.slug}: 자료 ${l.materialId} 가 materials.json 에 없습니다`);
            n += 1;
            return { number: n, sectionTitle: section.title, material };
        })
    );
}

/** 차시 화면에 띄울 주소: 문서 보기가 있으면 문서, 없으면 슬라이드 */
export function getLessonViewUrl(material: MaterialItem): string {
    return material.links.doc || material.links.slide || material.links.download || '/';
}
