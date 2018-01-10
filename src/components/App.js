import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Value, Block } from 'slate';
import { Editor } from 'slate-react';
import editList from 'slate-edit-list';
import stateJson from './initialState.json';
import {SortableContainer, SortableElement, arrayMove, SortableHandle} from 'react-sortable-hoc';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import immutable from 'immutable';

const options = {
    types: ['list'],
    typeItem: 'entity'
}
const editListPlugin = editList(options);
const plugins = [editListPlugin];

// To update the highlighting of nodes inside the selection
// highlightedItems.suppressShouldComponentUpdate = true;

class TextEditor extends Component {
    constructor(props) {
		super(props);

		this.state = {
			value: Value.fromJSON(stateJson),
            parentItems: {}
		};

        this.onChange = this.onChange.bind(this)
        this.renderNode = this.renderNode.bind(this)
        this.toggleListItem = this.toggleListItem.bind(this)
        this.handleEnterInput = this.handleEnterInput.bind(this)
	}

    onChange({ value }) {
        this.setState({ value });
    }
    
    toggleListItem(event, key, state) {
        let parentItems = this.state.parentItems;
        parentItems[key] = !this.state.parentItems[key];

        // Hack to focus on editor or this would not work until one of the items is clicked.
        this.editor.focus();

        this.setState({
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
        const {node, editor} = props;
        const value = editor.value
        const parent = value.document.getParent(node.key);
        console.log("node", parent.kind)
        return <ul {...props.attributes}>{props.children}</ul>
    }

    highlightedItems(props) {
        const {node, editor} = props;
        const value = editor.value
        const isCurrentItem = editListPlugin.utils.getItemsAtRange(value).contains(node)
        const depth = editListPlugin.utils.getItemDepth(value)
        const hasChildItems = props.children.length > 1

        // Only make the first depth of list items draggable.
        const parent = value.document.getParent(node.key)
        const index = parent.nodes.indexOf(node)
        const isFirstParent = value.document.nodes.get('0').key === parent.key
        const isDraggable = parent.nodes.size > 1
        const isMinimized = this.state.parentItems[node.key]
        let classNames = isCurrentItem ? 'current-item' : ''

        const ParentDragHandle = (
            <span className="list-icon" contentEditable={false}>
                <img
                    onClick={(event) => this.toggleListItem(event, node.key, value)}
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

        if (hasChildItems) {
            classNames = isMinimized ? `${classNames} closed parent-item` : `${classNames} open parent-item`;
        }
        classNames = isFirstParent ? `${classNames} first-parent-item` : classNames

        return (
            <li className={classNames}
                title={isCurrentItem ? 'Current Item' : ''}
                {...props.attributes}>
                {hasChildItems && ParentDragHandle}
                {!hasChildItems && isDraggable && <div className='drag-icon'><span onMouseOver={() => this.editor.blur()}>:::</span></div>}
                {
                    isDraggable &&
                    hasChildItems &&
                    <div className='drag-icon'>
                        <span contentEditable={false}>:::</span>
                    </div>
                }
                {console.log("props.children", props.children)}
                {props.children}
            </li>
        );
    }

    renderNode(props) {
        const { attributes, children, node } = props;
        switch (node.type) {
            case "list": return this.highlightedList(props);
            case "entity": return this.highlightedItems(props);
        }
    }

    handleEnterInput(event) {
        if (event.key === 'Enter') {
            const currentState = this.state.state
            const parentNode = currentState.document.nodes.get('0')
            const indexToInsert = parentNode.nodes.size
            let listNode = 
            {
                "kind": "block",
                "type": "entity",
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

            this[event.target.id].value = ''
            this[event.target.id].blur()
            this.setState({ state })
        }
    }

    render() {
        console.log("this.state", this.state)
        console.log("this.state.state", !this.state.value)
        if (!this.state.value) {
            return <span>Loading...</span>
        }
        return (
            <div className="modal">
                <h3>CASE</h3>
                <Editor
                    placeholder={'Enter some text...'}
                    ref={(editor) => { this.editor = editor; }}
                    plugins={plugins}
                    value={this.state.value}
                    onChange={this.onChange}
                    renderNode={this.renderNode}
                />
            </div>
        );
    }
};


const getItems = count => {
    const list = Array.from({ length: count }, (v, k) => k).map(k => ({
        id: `item-${k}`,
        content: `item ${k}`,
    }));
    return {
        "list-1": {
            group: [
                {id: 'item-12', content: 'item 12'},
                {id: 'item-13', content: 'item 13'},
                {id: 'item-14', content: 'item-14', group: list.splice(0, 6)},
                {id: 'item-15', content: 'item-15', group: list}
            ]
        },
    }
}

// using some little inline style helpers to make the app look okay
const grid = 8;
const getItemStyle = (draggableStyle, isDragging) => {
    return Object.assign({
        userSelect: 'none',
        padding: grid * 2,
        margin: `0 0 ${grid}px 0`,

        // change background colour if dragging
        background: isDragging ? 'lightgreen' : 'grey',
    }, draggableStyle)
};
const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  width: 250,
  display: 'inline-block',
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: getItems(12),
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

    // a little function to help us with reordering the result
    reorder(list, result) {
        const { source, destination } = result;

        const destinationIndex = destination.index;
        const destinationListName = destination.droppableId;
        const destinationList = list[destinationListName];
        
        const sourceIndex = source.index;
        const sourceListName = source.droppableId;
        const sourceList = list[sourceListName];
        const [removed] = sourceList.group.splice(sourceIndex, 1);

        destinationList.group.splice(destinationIndex, 0, removed);
        list[sourceListName] = sourceList;
        list[destinationListName] = destinationList;

        return list;
    };

    onDragEnd(result) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        console.log("result", result)

        const items = this.reorder(
            this.state.items,
            result
        );

        this.setState({
            items,
        });
    }

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
      console.log("this.state.items", this.state.items)
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="list-1">
        {(provided, snapshot) => (
            <div
            ref={provided.innerRef}
            
            >
            {this.state.items["list-1"].group.map((item, index) => {
                return (
                    <Draggable key={item.id} draggableId={item.id}>
                        {(provided, snapshot) => (
                            <div>
                                <div
                                    ref={provided.innerRef}
                                    style={getItemStyle(
                                    provided.draggableStyle,
                                    snapshot.isDragging
                                    )}
                                    
                                    {...provided.dragHandleProps}
                                >
                                    {item.content}
                                    {
                                        item.group &&
                                        <Droppable droppableId={item.id} type="list-1">
                                            {(providedd, snapshot) => (
                                                <div
                                                ref={provided.innerRef}
                                                style={getListStyle(snapshot.isDraggingOver)}
                                                >
                                                {item.group.map(innerItem => (
                                                    <Draggable key={innerItem.id} draggableId={innerItem.id} type="list-1">
                                                    {(provided, snapshot) => (
                                                        <div>
                                                            <div
                                                                ref={provided.innerRef}
                                                                style={getItemStyle(
                                                                provided.draggableStyle,
                                                                snapshot.isDragging
                                                                )}
                                                                
                                                                {...provided.dragHandleProps}
                                                            >
                                                                {innerItem.content}
                                                            </div>
                                                            {provided.placeholder}
                                                        </div>
                                                    )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                                </div>
                                            )}
                                        </Droppable>
                                    }
                                </div>
                                {provided.placeholder}
                            </div>
                        )}
                    </Draggable>
                )
            })}
            {provided.placeholder}
            </div>
        )}
        </Droppable>
      </DragDropContext>
    );
  }
}

export default TextEditor;
