import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { State, Block } from 'slate';
import { Editor } from 'slate-react';
import editList from 'slate-edit-list';
import stateJson from './initialState.json';

const plugin = editList();
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
        let parentItems = self.state.parentItems;
        parentItems[key] = !this.state.parentItems[key];

        // Hack to focus on editor or this would not work until one of the items is clicked.
        this.editor.focus();

        self.setState({
            parentItems: parentItems
        });
    }

    moveNode(node, currentState, callback) {
        const parentNode = currentState.document.getParent(node.key)
        const indexToInsert = 0
        let state = currentState
            .change()
            .deleteAtRange(currentState.selection)
            .insertNodeByKey(parentNode.key, indexToInsert, node)
            .deselect()
            .apply()

        callback(state)
    }

    onClickDrag(event, node) {
        event.preventDefault()
        
        this.moveNode(node, this.state.state, (state) => {
            let document = state.document;
            let parent = document.getParent(node.key)
            const index = parent.nodes.indexOf(node)
            parent = parent.removeNode(index)
            document = state.document.updateNode(parent)

            // Update the document and selection.
            state = state.set('document', document)
            this.setState({ state: state })
        })
    }

    highlightedItems(props) {
        const { node, state } = props;
        const isCurrentItem = plugin.utils.getItemsAtRange(state).contains(node);
        const depth = plugin.utils.getItemDepth(state);
        const hasChildItems = props.children.length > 1

        // Only make the first depth of list items draggable.
        const parent = state.document.getParent(node.key)
        const isDraggable = state.document.nodes.get('0').key === parent.key

        let classNames = isCurrentItem ? 'current-item' : '';

        if (hasChildItems) {
            classNames = this.state.parentItems[node.key] ? 'closed parent-item' : `${classNames} open parent-item`;
        }

        const onMouseDown = event => this.onClickDrag(event, node)

        return (
            <li className={classNames}
                title={isCurrentItem ? 'Current Item' : ''}
                {...props.attributes}>
                {
                    hasChildItems &&
                    <span className="list-icon">
                        {isDraggable && <i onMouseDown={onMouseDown} className="drag-icon fa fa-bars"></i>}
                        <img
                            onClick={(event) => this.toggleListItem(event, node.key, state)}
                            src={this.state.parentItems[node.key] ? './img/arrow_right.svg' : './img/arrow_down.svg'}
                        />
                    </span>
                }
                {props.children}
            </li>
        );
    };

    schema() {
        return {
            nodes: {
                ul_list:   props => <ul {...props.attributes}>{props.children}</ul>,
                ol_list:   props => <ol {...props.attributes}>{props.children}</ol>,
                list_item: props => this.highlightedItems(props)
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

    render() {
        return (
            <div className="modal">
                {this.renderToolbar()}
                <h3>TITLE</h3>
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
            </div>
        );
    }
};

export default TextEditor;


/*import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Editor } from 'slate-react';
import Plain from 'slate-plain-serializer';

class MyEditor extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      state: Plain.deserialize('A bit of content in a Slate editor.')
    }
  }

  onChange({ state }) {
    this.setState({ state })
  }

  render() {
    return (
      <div>   
        <div 
          style={{ 
          	background: 'black', 
            color: 'white', 
            width: 150, 
            height: 20, 
            textAlign: 'center',
            marginBottom: 20
           }} 
          draggable
          onDragStart={evt => {
          	evt.dataTransfer.setData('text/plain', ' ')
         	}}
        >Drop me in the text</div>
        <Editor
          placeholder="Enter some text..."
          
          onChange={state => this.onChange(state)}
          onDrop={(evt, data, state) => {
          	console.log({evt, data, state})
            const newState = state
            .transform()
            .deselect()
            .select(data.target)
            .insertText(' Drop me in the text ')
            .apply()

						return newState
          }}
          state={this.state.state}
        />
    	</div>
    )
  }

}

export default MyEditor;*/
