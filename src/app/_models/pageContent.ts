import {Paragraph} from './paragraph';

export interface PageContent {
    id?: string;
    paragraphs: Paragraph[];
}
