import {Component, OnInit} from '@angular/core';
import {AlertController, MenuController, NavController} from '@ionic/angular';
import {Row} from '../_models/row';
import {EditableNode, Node} from '../_models/node';
import {Paragraph} from '../_models/paragraph';
import {ActivatedRoute} from '@angular/router';
import {FirestoreService} from '../firestore.service';
import {AuthService} from '../auth.service';
import {PageInfo} from '../_models/pageInfo';
import {Page} from '../_models/page';

@Component({
    selector: 'app-subwiki',
    templateUrl: './subwiki.page.html',
    styleUrls: ['./subwiki.page.scss'],
})
export class SubwikiPage implements OnInit {
    subwiki: string;
    editing: boolean;
    page: Page;
    pageInfo: PageInfo;

    public isAuthenticated = false;

    constructor(
        private menuController: MenuController,
        private alertController: AlertController,
        private route: ActivatedRoute,
        private firestore: FirestoreService,
        private auth: AuthService,
        private navController: NavController,
    ) {
    }

    ngOnInit() {
    }

    ionViewWillEnter() {
        this.menuController.enable(true);
        this.route.paramMap.subscribe(params => {
            this.subwiki = params.get('name');
            if (params.has('page')) {
                this.firestore.getPageInfoByName(this.subwiki, params.get('page')).then(pageInfo => this.setPage(pageInfo));
            } else {
                this.firestore.getHomePageInfo(this.subwiki).then(pageInfo => this.setPage(pageInfo));
            }
        });
        this.auth.getUser().subscribe(user => {
            if (user) {
                this.isAuthenticated = true;
            } else {
                this.isAuthenticated = false;
            }
        });
    }

    private setPage(pageInfo: PageInfo) {
        this.pageInfo = pageInfo;
        this.firestore.getPage(this.pageInfo.pageRef).then(page => this.page = page);
    }

    startPageEditing() {
        this.editing = true;
    }

    endPageEditing() {
        this.editing = false;
        this.stopEditingAll();
        this.stripNodeEditingAttribute();
        this.firestore.updatePage(this.page);
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
            value: [{cells: [{value: ''}]}]
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

    deletePage() {
        this.alertController.create({
            header: 'Delete Page?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary'
                },
                {
                    text: 'Delete',
                    handler: () => {
                        this.firestore.deletePage(this.pageInfo);
                        this.navController.navigateForward(['subwiki', this.subwiki]);
                    }
                }
            ]
        }).then(alert => alert.present());
    }
}
