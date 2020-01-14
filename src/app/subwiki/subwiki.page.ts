import { Component, OnInit } from '@angular/core';
import { SubWiki } from '../_models/sub-wiki';
import { AlertController, MenuController } from '@ionic/angular';
import { Row } from '../_models/row';
import { EditableNode, Node } from '../_models/node';
import { Paragraph } from '../_models/paragraph';
import { PageContent } from '../_models/pageContent';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../firestore.service';
import { SubWikiContent } from '../_models/sub-wiki-content';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-subwiki',
    templateUrl: './subwiki.page.html',
    styleUrls: ['./subwiki.page.scss'],
})
export class SubwikiPage implements OnInit {
    subwiki: string;
    editing: boolean;
    page: PageContent;

    isAuthenticated = false;

    constructor(
        private menuController: MenuController,
        private alertController: AlertController,
        private route: ActivatedRoute,
        private firestore: FirestoreService,
        private auth: AuthService,
    ) { }

    ngOnInit() {
    }

    ionViewWillEnter() {
        this.menuController.enable(true);
        this.route.paramMap.subscribe(params => {
            this.subwiki = params.get('name');
            this.firestore.getPageContentByName(this.subwiki, params.get('page')).then(content => {
                this.page = content;
            });
        });
        this.auth.getUser().subscribe(user => {
            if (user) {
                this.isAuthenticated = true;
            }
        });
    }

    startPageEditing() {
        this.editing = true;
    }

    endPageEditing() {
        this.editing = false;
        this.stopEditingAll();
        this.stripNodeEditingAttribute();
        this.firestore.updatePageContent(this.page);
    }

    stripNodeEditingAttribute() {
        this.page.paragraphs.forEach(para => para.nodes.forEach(node => delete node.editing));
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
            value: [{ cells: [{ value: '' }] }]
        });
    }

    startEditing(node: EditableNode) {
        if (this.editing && !node.editing) {
            this.stopEditingAll();
            node.editing = true;
        }
    }

    stopEditing(paragraphKey: number, nodeKey: number) {
        const paragraph = this.page.paragraphs[paragraphKey];
        const node = paragraph.nodes[nodeKey] as EditableNode;
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
        row.cells.push({ value: '' });
    }

    addRow(node: Node) {
        (node.value as Row[]).push({ cells: [{ value: '' }] });
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
