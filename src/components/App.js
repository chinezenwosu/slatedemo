import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { State, Block } from 'slate';
import { Editor } from 'slate-react';
import editList from 'slate-edit-list';
import stateJson from './initialState.json';
import {SortableContainer, SortableElement, arrayMove, SortableHandle} from 'react-sortable-hoc';
import immutable from 'immutable';

const options = {
    types: ['categories'],
    typeItem: 'name'
}
const plugin = editList(options);
const plugins = [plugin];

// To update the highlighting of nodes inside the selection
// highlightedItems.suppressShouldComponentUpdate = true;

let self;

class TextEditor extends Component {
    constructor(props) {
		super(props);
        self = this;

		this.state = {
			state: State.fromJSON(stateJson),
            parentItems: {}
		};
	}

    onChange({ state }) {
        self.setState({
            state
        });
    }

    call(change) {
        self.setState({
            state: this.state.state.change().call(change).state
        });
    }

    toggleListItem(event, key, state) {
        let parentItems = this.state.parentItems;
        parentItems[key] = !this.state.parentItems[key];

        // Hack to focus on editor or this would not work until one of the items is clicked.
        this.editor.focus();

        self.setState({
            parentItems: parentItems
        });
    }

    swapNodes(nodes, firstIndex, secondIndex) {
        return nodes.map((element, index) => {
            if (index === firstIndex) return nodes.get(secondIndex);
            else if (index === secondIndex) return nodes.get(firstIndex);
            else return element;
        })
    }

    onSortEnd(props, {oldIndex, newIndex}) {
        let { node, state } = props
        let document = state.document
        let updatedParentNodes = this.swapNodes(node.nodes, oldIndex, newIndex)

        let updatedParent = node.set('nodes', updatedParentNodes)
        document = document.updateNode(updatedParent)

        state = state.set('document', document)
        this.setState({ state: state })
    }

    highlightedList(props) {
        const SortableList = SortableContainer(() =>
            <ul {...props.attributes}>{props.children}</ul>
        )

        return (
            <SortableList
                onSortMove={() => this.editor.blur()}
                onSortEnd={this.onSortEnd.bind(this, props)}
                lockAxis={'y'}
                lockToContainerEdges
                useDragHandle
                distance={5}
            />
        )
    }

    highlightedItems(props) {
        const { node, state } = props;
        const isCurrentItem = plugin.utils.getItemsAtRange(state).contains(node)
        const depth = plugin.utils.getItemDepth(state)
        const hasChildItems = props.children.length > 1

        // Only make the first depth of list items draggable.
        const parent = state.document.getParent(node.key)
        const index = parent.nodes.indexOf(node)
        const isFirstParent = state.document.nodes.get('0').key === parent.key
        const isDraggable = parent.nodes.size > 1
        const isMinimized = this.state.parentItems[node.key]
        let classNames = isCurrentItem ? 'current-item' : ''

        const ParentDragHandle = SortableHandle(() => {
            return (
                <span className="list-icon" contentEditable={false}>
                    <img
                        onClick={(event) => this.toggleListItem(event, node.key, state)}
                        onMouseMove={() => this.editor.blur()}
                        draggable={false}
                        src={this.state.parentItems[node.key] ? './img/arrow_right.svg' : './img/arrow_down.svg'}
                    />
                    <div className="icon-hover">
                        <span><strong>Drag</strong> to move</span>
                        <span><strong>Click</strong> to {isMinimized ? 'open' : 'close'} menu</span>
                    </div>
                </span>
            ) 
        })

        const DragHandle = SortableHandle(() => <span onMouseOver={() => this.editor.blur()}>:::</span>);

        if (hasChildItems) {
            classNames = isMinimized ? `${classNames} closed parent-item` : `${classNames} open parent-item`;
        }
        classNames = isFirstParent ? `${classNames} first-parent-item` : classNames

        const SortableItem = SortableElement(() =>
            <li className={classNames}
                title={isCurrentItem ? 'Current Item' : ''}
                {...props.attributes}>
                {hasChildItems && <ParentDragHandle />}
                {!hasChildItems && isDraggable && <div className='drag-icon'><DragHandle /></div>}
                {
                    isDraggable &&
                    hasChildItems &&
                    <div className='drag-icon'>
                        <span contentEditable={false}>:::</span>
                    </div>
                }
                {props.children}
            </li>
        )

        return (
            <SortableItem className={classNames} index={index} />
        );
    }

    schema() {
        return {
            nodes: {
                categories:   props => this.highlightedList(props),
                name: props => this.highlightedItems(props)
            }
        }
    }

    renderToolbar() {
        const { wrapInList, unwrapList, increaseItemDepth, decreaseItemDepth } = plugin.changes;
        const inList = plugin.utils.isSelectionInList(this.state.state);

        return (
            <div className='toolbar'>
                <button className={inList ? 'active' : ''} onClick={() => this.call(inList ? unwrapList : wrapInList)}>
                    <i className="fa fa-list-ul fa-lg"></i>
                </button>

                <button className={inList ? '' : 'disabled'} onClick={() => this.call(decreaseItemDepth)}>
                    <i className="fa fa-outdent fa-lg"></i>
                </button>

                <button className={inList ? '' : 'disabled'} onClick={() => this.call(increaseItemDepth)}>
                    <i className="fa fa-indent fa-lg"></i>
                </button>

                <button onClick={() => this.call(wrapInList)}>Wrap in list</button>
                <button onClick={() => this.call(unwrapList)}>Unwrap from list</button>
            </div>
        );
    }

    handleEnterInput(event) {
        if (event.key === 'Enter') {
            const currentState = self.state.state
            const parentNode = currentState.document.nodes.get('0')
            const indexToInsert = parentNode.nodes.size
            let listNode = 
            {
                "kind": "block",
                "type": "name",
                "nodes": [
                    {
                        "kind": "block",
                        "type": "paragraph",
                        "nodes": [
                            {
                                "kind": "text",
                                "ranges": [
                                    {
                                    "text": event.target.value
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }

            let state = currentState
                .change()
                .insertNodeByKey(parentNode.key, indexToInsert, listNode)
                .apply()

            self[event.target.id].value = ''
            self[event.target.id].blur()
            self.setState({ state: state })
        }
    }

    render() {
        let categories = ['symptom', 'medication', 'medical/surgical history', 'family/social history', 'physical exam', 'lab/radiology']

        return (
            <div className="modal">
                {this.renderToolbar()}
                <h3>CASE TITLE</h3>
                <textarea
                    value="13 year old with a Type 1 Diabetes presenting high glucose level and heart rate."
                    onChange={() => {}}
                    className="textarea"
                    placeholder="50M with h/o DM c/o substernal chest pain. Do I need an EKG?"
                />

                <h3>CASE</h3>
                <Editor
                    placeholder={'Enter some text...'}
                    ref={(editor) => { this.editor = editor; }}
                    plugins={plugins}
                    state={this.state.state}
                    onChange={this.onChange}
                    schema={this.schema()}
                />

                <div className="ontology-observations">
                    {
                        categories.map((category, index) => {
                            return (
                                <input
                                    key={category}
                                    id={`searchInput${index}`}
                                    ref={(searchInput) => { this[`searchInput${index}`] = searchInput; }}
                                    type="text"
                                    onKeyPress={this.handleEnterInput}
                                    className="text-input"
                                    placeholder={`+ Add ${category}`}
                                />
                            )
                        })
                    }
                </div>
            </div>
        );
    }
};

export default TextEditor;
