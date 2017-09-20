import React, { Component } from 'react';
import { Editor } from 'slate-react';
import { State, Block } from 'slate';
import editList from 'slate-edit-list';

import initialState from './initialState.json';

const listPlugin = editList({
	listType: 'ul_list',
	itemType: 'list_item',
	defaultType: 'paragraph',
});
const plugins = [listPlugin];

let self;

class TextEditor extends Component {

	constructor(props) {
		super(props);
		self = this;
		this.state = {
		content: State.fromJSON(initialState),
		listItemsToggleStatus: [],
		};
		this.schema = {
			nodes: {
				'section': (props) => <div {...props.attrs}>{props.children}</div>,
				'title': (props) => <h3 {...props.attrs}>{props.children}</h3>,
				'paragraph': (props) => <p {...props.attrs}>{props.children}</p>,
				'span': (props) => <span {...props.attrs}>{props.children}</span>,
				'ul_list': (props) => <ul {...props.attrs}>{props.children}</ul>,
				'ol_list': (props) => <ol {...props.attrs}>{props.children}</ol>,
				'list_item': self.processListItems,
			},
			marks: {
				bold: {
					fontWeight: 'bold',
				},
				code: {
					fontFamily: 'monospace',
					backgroundColor: '#eee',
					padding: '3px',
					borderRadius: '4px',
				},
				italic: {
					fontStyle: 'italic',
				},
				underlined: {
					textDecoration: 'underline',
				},
			},
			rules: [{
				/* Rule that always makes the first block a title, normalizes by inserting one if no children, or setting the top to be a title */
				match: (node) => node.kind === 'document',
				validate: (document) => !document.nodes.size || document.nodes.first().type !== 'title' ? document.nodes : null,
				normalize: (change, document, nodes) => {
					if (!nodes.size) {
						const title = Block.create({ type: 'title', data: {} });
						return change.insertNodeByKey(document.key, 0, title);
					}

					return change.setNodeByKey(nodes.first().key, 'title');
				},
			}, {
				/* Rule that only allows for one title, normalizes by making titles paragraphs */
				match: (node) => node.kind === 'document',
				validate: (document) => {
					const invalidChildren = document.nodes.filter((child, index) => child.type === 'title' && index !== 0);
					return invalidChildren.size ? invalidChildren : null;
				},
				normalize: (change, document, invalidChildren) => {
					let updatedTransform = change;
					invalidChildren.forEach((child) => {
						updatedTransform = change.setNodeByKey(child.key, 'paragraph');
					});
					return updatedTransform;
				},
			}, {
				/* Rule that forces at least one paragraph, normalizes by inserting an empty paragraph */
				match: (node) => node.kind === 'document',
				validate: (document) => document.nodes.size < 2 ? true : null,
				normalize: (change, document) => {
					const paragraph = Block.create({ type: 'paragraph', data: {} });
					return change.insertNodeByKey(document.key, 1, paragraph);
				},
			}],
		};
		this.processListItems.suppressShouldComponentUpdate = true;
	};
	hasBlock(type) {
		const state = this.state.content;
		return state.blocks.some((node) => node.type == type);
	};

	onChange({ state }) {
		self.setState({ content: state });
	};

	processListItems(props) {
		const { state, node } = props;
		const depth = listPlugin.utils.getItemDepth(state);
		const text = props.children[0].props.node.text;
		// add a minimize prop to item if it does not exist
		let itemStatusIndex = self.state.listItemsToggleStatus.findIndex((item) => item.key === node.key);
		if (itemStatusIndex < 0) {
			self.state.listItemsToggleStatus.push({
				key: node.key,
				minimize: false,
			});
			itemStatusIndex = self.state.listItemsToggleStatus.length - 1;
		}
		return (
			<li
				{...props.attributes}>
				<img
				onClick={() => self.toggleListItem(itemStatusIndex)}
				className='list-icon'
				src={self.state.listItemsToggleStatus[itemStatusIndex].minimize ? './img/arrow_right.svg' : './img/arrow_down.svg'}
			/>
				{ self.state.listItemsToggleStatus[itemStatusIndex].minimize ? <span>{text}</span> : props.children }
			</li>
		);
	};

	toggleListItem(index) {
		let listItemsToggleStatus = this.state.listItemsToggleStatus;
		listItemsToggleStatus[index].minimize = !listItemsToggleStatus[index].minimize;
		this.setState({
			listItemsToggleStatus,
		});
	}

	onKeyDown(e, data, change) {
		if (!data.isMod) return;
		let mark;

		switch (data.key) {
			case 'b':
			mark = 'bold';
			break;
			case 'i':
			mark = 'italic';
			break;
			case 'u':
			mark = 'underlined';
			break;
			case '`':
			mark = 'code';
			break;
			default:
			return;
		};

		e.preventDefault();
		change.toggleMark(mark);
		return true;
	};

	renderEditor() {
		return (
			<div className="editor">
				<Editor
					state={this.state.content}
					onChange={this.onChange}
					onKeyDown={this.onKeyDown}
					schema={this.schema}
					plugins={plugins}
					placeholder={'Enter some text...'}
					spellCheck
				/>
			</div>
		);
	}

	render() {
		return (
			<section className="modal">
				{this.renderEditor()}
			</section>
		);
	}
}

export default TextEditor;
