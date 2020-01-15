import {Row} from './row';

export interface Node {
    value: string | Row[];
    type: string;
}

export interface EditableNode extends Node {
    editing?: boolean;
}
