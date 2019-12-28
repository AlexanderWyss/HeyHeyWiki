import {Component, OnInit} from '@angular/core';
import {SubWiki} from '../_models/sub-wiki';
import {AlertController, MenuController} from '@ionic/angular';

interface PageContent {
    title: string;
    paragraphs: Paragraph[];
}

interface Paragraph {
    title: string;
    nodes: Node[];
}

interface Node {
    value: string | Row[];
    type: string;
    editing?: boolean;
}

interface Row {
    cells: Cell[];
}

interface Cell {
    value: string;
}

@Component({
    selector: 'app-subwiki',
    templateUrl: './subwiki.page.html',
    styleUrls: ['./subwiki.page.scss'],
})
export class SubwikiPage implements OnInit {
    subwiki: SubWiki;
    editing: boolean;
    page: PageContent;

    constructor(private menuController: MenuController, private alertController: AlertController) {
    }

    ngOnInit() {
        this.page = {
            title: 'Döme',
            paragraphs: [
                {
                    title: 'Paragraph 1',
                    nodes: [
                        {
                            value: 'Existence is Pain',
                            type: 'text'
                        },
                        {
                            value: 'yepjsdfl',
                            type: 'text'
                        }
                    ]
                },
                {
                    title: 'Paragraph 2',
                    nodes: [
                        {
                            value: 'Existence is Painfull bastard',
                            type: 'text'
                        },
                        {
                            value: [{cells: [{value: 'yepjsdfladfs'}, {value: 'bla'}]}, {cells: [{value: 'yep'}]}],
                            type: 'grid'
                        }
                    ]
                }
            ]
        };
    }

    ionViewWillEnter() {
        this.menuController.enable(true);
    }

    toggleEditing() {
        this.editing = !this.editing;
        if (!this.editing) {
            this.stopEditingAll();
        }
    }

    addParagraph() {
        this.page.paragraphs.push({
            title: '',
            nodes: [
                {
                    value: '',
                    type: 'text'
                }
            ]
        });
    }

    addText(paragraph: Paragraph) {
        this.stopEditingAll();
        paragraph.nodes.push({
            value: '',
            type: 'text',
            editing: true
        });
    }

    addGrid(paragraph: Paragraph) {
        paragraph.nodes.push({
            type: 'grid',
            editing: true,
            value: [{cells: [{value: ''}]}]
        });
    }

    startEditing(node: Node) {
        if (this.editing && !node.editing) {
            this.stopEditingAll();
            node.editing = true;
        }
    }

    stopEditing(paragraphKey: number, nodeKey: number) {
        const paragraph = this.page.paragraphs[paragraphKey];
        const node = paragraph.nodes[nodeKey];
        node.editing = false;
        if (this.isEmpty(node)) {
            this.removeNode(paragraphKey, nodeKey);
        }
    }

    removeNode(paragraphKey: number, nodeKey: number) {
        this.page.paragraphs[paragraphKey].nodes.splice(nodeKey, 1);
    }

    isEmpty(node: Node) {
        if (node.type === 'text') {
            return !node.value || (node.value as string).trim() === '';
        } else if (node.type === 'grid') {
            return !node.value || (node.value as Row[])
                .filter(row => row.cells.filter(col => col.value.trim() !== '').length > 0).length === 0;
        }
        return false;
    }

    private stopEditingAll() {
        for (let i = 0; i < this.page.paragraphs.length; i++) {
            const paragraph = this.page.paragraphs[i];
            for (let j = 0; j < paragraph.nodes.length; j++) {
                this.stopEditing(i, j);
            }
        }
    }

    removeParagraph(key: number) {
        this.alertController.create({
            header: 'Delete Paragraph?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary'
                },
                {
                    text: 'Delete',
                    handler: () => {
                        this.page.paragraphs.splice(key, 1);
                    }
                }
            ]
        }).then(alert => alert.present());
    }

    addCol(row: Row) {
        row.cells.push({value: ''});
    }

    addRow(node: Node) {
        (node.value as Row[]).push({cells: [{value: ''}]});
    }

    asRowArray(value: string | Row[]): Row[] {
        return value as Row[];
    }

    removeCell(node: Node, rowIndex: number, colIndex: number) {
        (node.value as Row[])[rowIndex].cells.splice(colIndex, 1);
        if ((node.value as Row[])[rowIndex].cells.length === 0) {
            this.removeRow(node, rowIndex);
        }
    }

    removeRow(node: Node, rowIndex: number) {
        (node.value as Row[]).splice(rowIndex, 1);
    }
}
