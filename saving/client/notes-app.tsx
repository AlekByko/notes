import React from 'react';
import { broke, escapePlainTextForRegExp, isNull, isUndefined } from '../shared/core';
import { CardProps } from './cards';
import { thusCardLister } from './cards-lister';
import { startListening } from './eventing';
import { ExecRegistry } from './exec-registry';
import { enableMoving, NoteDefaults, NoteProps } from './note';
import { NotesGlob } from './notes-glob';
import { thusNotesSearch } from './notes-search';
import { CardKey, defaultNoteBox, makeCardKey, NoteConfig, NotesWorkspaceConfig } from './notes-workspace';
import { Box } from './reading-query-string';
import { TextDrop } from './text-drop';

export type NotesExec = (command: string) => void;
export interface NotesAppProps {
    workspace: NotesWorkspaceConfig;
    workspaceDir: FileSystemDirectoryHandle;
    glob: NotesGlob;
    execs: ExecRegistry;
    onChangedWorkspace(): void;
}



interface State {
    cards: CardProps[];
    shouldShowSearch: boolean;
}

const grabbingClassName = 'as-grabbing';
export function thusNotesApp(defaults: NoteDefaults) {
    const Lister = thusCardLister(defaults);
    const Search = thusNotesSearch(500);
    return class NotesApp extends React.Component<NotesAppProps, State> {



        private whenChangingBox = (key: CardKey, box: Partial<Box>) => {
            const { workspace } = this.props;
            const found = workspace.notes.find(x => x.key === key);
            if (isUndefined(found)) return;
            found.box = { ...found.box, ...box };
            this.props.onChangedWorkspace();
        }

        private whenChangingTitle = (key: CardKey, title: string) => {
            const { workspace } = this.props;
            const found = workspace.notes.find(x => x.key === key);
            if (isUndefined(found)) return;
            found.title = title;
            this.props.onChangedWorkspace();
        }

        private whenLookingAtCard = (cardKey: CardKey) => {
            const { notesCanvasPinnacleElement } = this;
            if (isNull(notesCanvasPinnacleElement)) return;
            const card = this.state.cards.find(x => x.cardKey === cardKey);
            if (isUndefined(card)) return;
            const { x: cx, y: cy } = card.box;
            const [dx, dy] = [100, 100];
            const x = -cx + dx;
            const y = -cy + dy;
            notesCanvasPinnacleElement.style.top = y + 'px';
            notesCanvasPinnacleElement.style.left = x + 'px';
        }
        private whenSelectingCard = (cardKey: CardKey) => {
            const { notesCanvasPinnacleElement } = this;
            if (isNull(notesCanvasPinnacleElement)) return;
            const card = this.state.cards.find(x => x.cardKey === cardKey);
            if (isUndefined(card)) return;
            const { x: cx, y: cy } = card.box;
            const [dx, dy] = [100, 100];
            const x = -cx + dx;
            const y = -cy + dy;
            notesCanvasPinnacleElement.style.top = y + 'px';
            notesCanvasPinnacleElement.style.left = x + 'px';
            this.setState({ shouldShowSearch: false }, () => {
                const { workspace } = this.props;
                workspace.x = x;
                workspace.y = y;
                this.props.onChangedWorkspace();
            });
        };
        private whenHidingSearch = () => {
            this.setState({ shouldShowSearch: false });
        };

        private createNote(x: number, y: number, title: string) {
            const cardKey = makeCardKey();
            const path = `${cardKey}.txt`;
            const config: NoteConfig = {
                kind: 'note', key: cardKey, path, box: { ...defaultNoteBox, x, y }, title,
            };
            const { workspace } = this.props;
            const note = this.makeNoteProps(config);
            this.setState(state => {
                workspace.notes.push(config);
                let { cards } = state;
                cards = [...cards, note];
                return { ...state, cards } satisfies State;
            }, () => {
                this.props.onChangedWorkspace();
            });
        }
        private whenDeleting = (key: CardKey) => {
            const { workspace } = this.props;
            const foundAt = workspace.notes.findIndex(x => x.key === key);
            if (foundAt < 0) return console.log('No note to delete: ' + key);
            this.setState(state => {
                workspace.notes.splice(foundAt, 1);

                let { cards } = state;
                cards = cards.filter(x => x.cardKey !== key);
                return { ...state, cards } satisfies State;
            }, () => this.props.onChangedWorkspace());
        }
        private notesCanvasPinnacleElement: HTMLDivElement | null = null;
        private notesCanvasElement: HTMLDivElement | null = null;
        private nomores: Act[] = [];
        componentDidMount(): void {
            const { notesCanvasElement, notesCanvasPinnacleElement } = this;
            if (isNull(notesCanvasElement) || isNull(notesCanvasPinnacleElement)) return;

            this.nomores.push(startListening(notesCanvasElement, 'dblclick', e => {
                e.preventDefault();
                e.stopPropagation();
                const title = prompt();
                if (isNull(title)) return;
                const { left: canvasX, top: canvasY } = notesCanvasPinnacleElement.getBoundingClientRect();
                const { clientX, clientY } = e;
                const x = clientX - canvasX;
                const y = clientY - canvasY;
                this.createNote(x, y, title);
            }));

            const { workspace } = this.props;
            notesCanvasPinnacleElement.style.left = workspace.x + 'px';
            notesCanvasPinnacleElement.style.top = workspace.y + 'px';
            const nomore = enableMoving(notesCanvasElement, notesCanvasPinnacleElement, {
                readPos: element => {
                    const { top: y, left: x } = element.getBoundingClientRect();
                    notesCanvasElement.classList.add(grabbingClassName);
                    const pos = { x, y };
                    // console.log({ x, y });
                    return pos;
                },
                applyDelta: (element, pos, dx, dy) => {
                    element.style.top = (pos.y + dy) + 'px';
                    element.style.left = (pos.x + dx) + 'px';
                },
                reportPos: (pos, dx, dy) => {
                    console.log({ pos, dx, dy });
                    notesCanvasElement.classList.remove(grabbingClassName);
                    const { workspace } = this.props;
                    workspace.x = pos.x + dx;
                    workspace.y = pos.y + dy;
                    this.props.onChangedWorkspace();
                }
            });
            this.nomores.push(nomore);

            const { execs } = this.props;
            execs.add(this.exec);
        }

        private exec = (text: string) => {
            if (text === 'find') {
                this.setState({ shouldShowSearch: true });
            }
        }

        componentWillUnmount(): void {
            const { execs } = this.props;
            execs.remove(this.exec);

            this.nomores.forEach(nomore => {
                nomore();
            });
        }

        private makeState(): State {
            const { workspace } = this.props;
            const cards = workspace.notes.map(config => {
                return this.makeNoteProps(config);
            });
            return { cards, shouldShowSearch: false };
        }

        state = this.makeState();

        private makeNoteProps(config: NoteConfig) {
            const { workspaceDir } = this.props;
            const { path, key, box, title } = config;
            const drop = new TextDrop(workspaceDir, path);
            const note: NoteProps = {
                kind: 'note',
                cardKey: key, drop, box, title,
                onChangedBox: this.whenChangingBox,
                onChangedTitle: this.whenChangingTitle,
                onDeleting: this.whenDeleting,
            };
            return note;
        }

        private search = (text: string) => {
            return this.state.cards.filter(x => {
                switch (x.kind) {
                    case 'area': return false;
                    case 'note': {
                        const escaped = escapePlainTextForRegExp(text);
                        const reg = new RegExp(escaped, 'ig');
                        const hasIt = reg.test(x.drop.lastText);
                        return hasIt;
                    }
                    default: return broke(x);
                }
            });
        }

        render() {
            const { cards, shouldShowSearch } = this.state;
            return <div className="notes">
                <div className="notes-canvas" ref={el => this.notesCanvasElement = el}>
                    <div className="notes-canvas-pinnacle" ref={el => this.notesCanvasPinnacleElement = el}>
                        <Lister cards={cards} />
                    </div>
                </div>
                {/* <div className="notes-toolbar"></div> */}
                {shouldShowSearch &&
                    <Search
                        search={this.search}
                        onPreview={this.whenLookingAtCard}
                        onSelect={this.whenSelectingCard}
                        onHide={this.whenHidingSearch}
                    />
                }
            </div>;
        }
    };
}
