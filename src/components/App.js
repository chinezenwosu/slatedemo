import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { Value } from 'slate';
import { Editor, getEventRange } from 'slate-react';
import editList from 'slate-edit-list';
import stateJson from './initialState.json';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

const options = {
    types: ['categories'],
    typeItem: 'name',
};

const plugin = editList(options);
const plugins = [plugin];

const itemSource = {
    canDrag(props) {
		return props.isDraggable;
    },

	beginDrag(props) {
		return {
            key: props.attributes['data-key'],
            index: props.index,
            parentKey: props.parentKey,
		};
    },
};

const itemSourceConnect = (connect, monitor) => {
    const connectObj = {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
        canDrag: monitor.canDrag(),
    };
    return connectObj;
 };


const listTarget = {
    drop(props, monitor) {
        const parentKey = props.key;
        const targetParentKey = monitor.getItem().parentKey;
        if ( parentKey !== targetParentKey ) {
            // Perform sort action
            return {
                parentKey,
            };
        }
    },
};

const listTargetConnect = (connect, monitor) => {
    const connectObj = {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver({ shallow: true }),
        canDrop: monitor.canDrop(),
    };
    return connectObj;
 };

class ListItem extends Component {

	render() {
        const {
            attributes,
            children,
            editor,
            classNames,
            connectDragSource,
            canDrag,
            hasChildItems,
			isDragging,
            isMinimized,
            node,
            parentItems,
            title,
            toggleListItem,
            value,

        } = this.props;
        const opacity = isDragging ? 0.4 : 1;
        // const parentDragHandle = () => {
        //         return (<span className="list-icon" contentEditable={false}>
        //             <img
        //                 onClick={(event) => toggleListItem(event, node.key, value)}
        //                 onMouseMove={() => editor.blur()}
        //                 draggable={false}
        //                 src={parentItems[node.key] ? './img/arrow_right.svg' : './img/arrow_down.svg'}
        //             />
        //             <div className="icon-hover">
        //                 <span><strong>Drag</strong> to move</span>
        //                 <span><strong>Click</strong> to {isMinimized ? 'open' : 'close'} menu</span>
        //             </div>
        //         </span>);
        // };
        // const dragHandle = () => (<span onMouseOver={() => editor.blur()}>:::</span>);
        return connectDragSource(<li className={classNames} title={title} style={{ opacity }} {...attributes}>{children}</li>);
	}
}

const DragabbleListItem = DragSource('LIST', itemSource, itemSourceConnect)(ListItem);


class List extends Component {

    render() {
        const { attributes, children, connectDropTarget, canDrop, isOver } = this.props;
        const opacity = canDrop && isOver ? 0.7 : 1;
        return connectDropTarget(<ul style={{ opacity }} {...attributes}>{children}</ul>);
    }
}

const DroppableList = DropTarget('LIST', listTarget, listTargetConnect)(List);

// To update the highlighting of nodes inside the selection
// highlightedItems.suppressShouldComponentUpdate = true;

let self;

class TextEditor extends Component {
    constructor(props) {
		super(props);
        self = this;

		this.state = {
			value: Value.fromJSON(stateJson),
            parentItems: {},
        };

        this.highlightedItems = this.highlightedItems.bind(this);
        this.highlightedList = this.highlightedList.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.toggleListItem = this.toggleListItem.bind(this);
	}

    onChange(change) {
        this.setState({
          value: change.value,
        });
    }

    onDrop(event, change) {
        const { value } = change;
        const { document, selection } = value;
        let target = getEventRange(event, value);
        const targetNode = document.getParent(target.anchorKey);
        const draggedNode = document.getParent(selection.anchorKey);
        const targetParent = document.getParent(targetNode.key);
        const draggedParent = document.getParent(draggedNode.key);
        const targetGrandParent = document.getParent(targetParent.key);
        const index = targetGrandParent.nodes.indexOf(targetParent);
        change.moveNodeByKey(draggedParent.key, targetGrandParent.key, index);
        this.onChange(change);
    }

    call(change) {
        self.setState({
            value: this.state.value.change().call(change).value,
        });
    }

    toggleListItem(event, key, value) {
        let parentItems = this.state.parentItems;
        parentItems[key] = !this.state.parentItems[key];

        // Hack to focus on editor or this would not work until one of the items is clicked.
        this.editor.focus();

        self.setState({
            parentItems: parentItems,
        });
    }

    swapNodes(nodes, firstIndex, secondIndex) {
        return nodes.map((element, index) => {
            if (index === firstIndex) return nodes.get(secondIndex);
            else if (index === secondIndex) return nodes.get(firstIndex);
            else return element;
        });
    }

    highlightedList(props) {
        return (
            <DroppableList
                attributes={props.attributes}
                children={props.children}
             />
        );
    }

    highlightedItems(props) {
        const { node, editor } = props;
        const { value } = editor;
        const isCurrentItem = plugin.utils.getItemsAtRange(value).contains(node);
        const hasChildItems = props.children.length > 1;

        // Only make the first depth of list items draggable.
        const parent = value.document.getParent(node.key);
        const index = parent.nodes.indexOf(node);
        const isFirstParent = value.document.nodes.get('0').key === parent.key;
        const isDraggable = parent.nodes.size > 1;
        const isMinimized = this.state.parentItems[node.key];
        let classNames = isCurrentItem ? 'current-item' : '';

        if (hasChildItems) {
            classNames = isMinimized ? `${classNames} closed parent-item` : `${classNames} open parent-item`;
        }
        classNames = isFirstParent ? `${classNames} first-parent-item` : classNames;

        return (
            <DragabbleListItem
                classNames={classNames}
                title={isCurrentItem ? 'Current Item' : ''}
                attributes={props.attributes}
                children={props.children}
                node={node}
                index={index}
                hasChildItems={hasChildItems}
                isDraggable={isDraggable}
                isMinimized={isMinimized}
                editor={editor}
                value={value}
                toggleListItem={self.toggleListItem}
                parentItems={self.state.parentItems}
                parentKey={parent.key}
        />);
    }

    renderNode(props) {
        const { node } = props;
        switch (node.type) {
            case 'categories': return self.highlightedList(props);
            case 'name': return self.highlightedItems(props);
        }
     }

     renderMark(props) {
        const { children, mark } = props;
        switch (mark.type) {
            case 'bold': return <strong>{children}</strong>;
            case 'code': return <code>{children}</code>;
            case 'italic': return <em>{children}</em>;
            case 'underlined': return <u>{children}</u>;
        }
    }

    renderToolbar() {
        const { wrapInList, unwrapList, increaseItemDepth, decreaseItemDepth } = plugin.changes;
        const inList = plugin.utils.isSelectionInList(this.state.value);

        return (
            <div className='toolbar'>
                <button className={inList ? 'active' : ''} onClick={() => this.call(inList ? unwrapList : wrapInList)}>
                    <i className="fa fa-list-ul fa-lg" />
                </button>

                <button className={inList ? '' : 'disabled'} onClick={() => this.call(decreaseItemDepth)}>
                    <i className="fa fa-outdent fa-lg" />
                </button>

                <button className={inList ? '' : 'disabled'} onClick={() => this.call(increaseItemDepth)}>
                    <i className="fa fa-indent fa-lg" />
                </button>

                <button onClick={() => this.call(wrapInList)}>Wrap in list</button>
                <button onClick={() => this.call(unwrapList)}>Unwrap from list</button>
            </div>
        );
    }

    handleEnterInput(event) {
        if (event.key === 'Enter') {
            const currentState = self.state.value;
            const parentNode = currentState.document.nodes.get('0');
            const indexToInsert = parentNode.nodes.size;
            let listNode =
            {
                'kind': 'block',
                'type': 'name',
                'nodes': [
                    {
                        'kind': 'block',
                        'type': 'paragraph',
                        'nodes': [
                            {
                                'kind': 'text',
                                'ranges': [
                                    {
                                    'text': event.target.value,
                                    },
                                ],
                            },
                        ],
                    },
                ],
            };
            let state = currentState.change().insertNodeByKey(parentNode.key, indexToInsert, listNode).value;

            self[event.target.id].value = '';
            self[event.target.id].blur();
            self.setState({ value: state });
        }
    }

    render() {
        let categories = ['symptom', 'medication', 'medical/surgical history', 'family/social history', 'physical exam', 'lab/radiology'];

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
                    ref={(editor) => {
                        this.editor = editor;
                    }}
                    plugins={plugins}
                    value={this.state.value}
                    onChange={this.onChange}
                    onDrop={this.onDrop}
                    renderNode={this.renderNode}
                    renderMark={this.renderMark}
                />

                <div className="ontology-observations">
                    {
                        categories.map((category, index) => {
                            return (
                                <input
                                    key={category}
                                    id={`searchInput${index}`}
                                    ref={(searchInput) => {
                                    this[`searchInput${index}`] = searchInput;
                                    }}
                                    type="text"
                                    onKeyPress={this.handleEnterInput}
                                    className="text-input"
                                    placeholder={`+ Add ${category}`}
                                />
                            );
                        })
                    }
                </div>
            </div>
        );
    }
};

export default DragDropContext(HTML5Backend)(TextEditor);
