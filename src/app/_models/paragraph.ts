import {EditableNode, Node} from './node';

export interface Paragraph {
    title: string;
    nodes: EditableNode[] | Node[];
}
