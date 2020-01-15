import {Paragraph} from './paragraph';

export interface Page {
    id?: string;
    paragraphs: Paragraph[];
}
