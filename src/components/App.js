import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { Value } from 'slate';
import { Editor } from 'slate-react';
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

    endDrag(props, monitor) {
		const item = monitor.getItem();
		const dropResult = monitor.getDropResult();
        console.log('END DRAG SS', item, dropResult);
        // Perform remove action if item was moved to another list.
		if ( dropResult && dropResult.parentKey !== item.parentKey ) {
			props.removeItem(item.key);
		}
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

const itemTarget = {

    hover(props, monitor, component) {
        const itemIndex = monitor.getItem().index;
		const targetIndex = props.index;
        const itemKey = monitor.getItem().key;
        const targetKey = props.attributes['data-key'];
        const targetParentKey = props.parentKey;
        const itemParentKey = monitor.getItem().parentKey;

        // dont replace items with themselves
        if (itemIndex === targetIndex || itemParentKey === targetParentKey) {
            return;
        }

        // Determine rectangle on screen
        const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

        // Get vertical middle
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

        // Determine mouse position
        const clientOffset = monitor.getClientOffset();

        // Get pixels to the top
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

        // Only perform the move when the mouse has crossed half of the items height
        // When dragging downwards, only move when the cursor is below 50%
        // When dragging upwards, only move when the cursor is above 50%

        // Dragging downwards
        if (itemKey < targetKey && hoverClientY < hoverMiddleY) {
            return;
        }

        // Dragging upwards
        if (itemKey > targetKey && hoverClientY > hoverMiddleY) {
            return;
        }

        // Perform sort action if item is in the same list.
        if(itemParentKey === targetParentKey) {
            props.sortItems({ itemKey, targetKey, targetIndex });

            // Note: we're mutating the monitor item here!
            // to avoid expensive index searches.
            monitor.getItem().key = targetKey;
        }
    },
};

const itemTargetConnect = (connect) => {
    const connectObj = {
        connectDropTarget: connect.dropTarget(),
    };
    return connectObj;
 };

const listTarget = {
    drop(props, monitor) {
        // Check if the item drop has been handled by a child list and return.
        console.log('DROP SS', props, monitor);
        const droppedInChild = monitor.didDrop();
        if (droppedInChild) {
            return;
        }
        const parentKey = props.key;
        const itemKey = monitor.getItem().key;
        const targetParentKey = monitor.getItem().parentKey;
        const targetIndex = monitor.getItem().index;
        // Perform drop action if item was moved from one list to another.
        if ( parentKey !== targetParentKey ) {
            // Perform sort action
            props.insertItem({ itemKey, parentKey, targetIndex });
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
            connectDropTarget,
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
        return connectDragSource(
			connectDropTarget(<li className={classNames} title={title} style={{ opacity }} {...attributes}>{children}</li>),
		);
	}
}

const ItemDragWrap = DragSource('LIST', itemSource, itemSourceConnect)(ListItem);
const DragabbleListItem = DropTarget('LIST', itemTarget, itemTargetConnect)(ItemDragWrap);


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
        this.insertItem = this.insertItem.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.sortItems = this.sortItems.bind(this);
        this.toggleListItem = this.toggleListItem.bind(this);
	}

    onChange(change) {
        this.setState({
          value: change.value,
        });
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

    insertItem({ itemKey, parentKey, index }) {
        console.log(itemKey, index, 'INSERT');
        this.editor.change((change) => {
            const { document } = change.value;
            const node = document.assertKey(itemKey);
            change.insertNodeByKey(parentKey, index, node);
            this.onChange(change);
        });
    }

    removeItem({ itemKey }) {
        console.log(itemKey, 'REMOVE');
        this.editor.change((change) => {
            change.removeNodeByKey(itemKey);
            this.onChange(change);
        });
    }

    sortItems({ itemKey, targetKey, targetIndex }) {
        this.editor.change((change) => {
            const { document } = change.value;
            const targetNode = document.assertNode(targetKey);
            const parent = document.getParent(targetNode.key);
            change.moveNodeByKey(itemKey, parent.key, targetIndex);
            this.onChange(change);
        });
    }

    highlightedList(props) {
        return (
            <DroppableList
                attributes={props.attributes}
                children={props.children}
                insertItem={self.insertItem}
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
                removeItem={self.removeItem}
                sortItems={self.sortItems}
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
