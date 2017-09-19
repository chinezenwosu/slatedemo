import React, { Component } from 'react';
import { Editor } from 'slate-react';
import { State } from 'slate';

import initialState from './initialState.json';

const DEFAULT_NODE = 'paragraph';

const schema = {
	nodes: {
		'block-quote': (props) => <blockquote {...props.attributes}>{props.children}</blockquote>,
		'bulleted-list': (props) => <ul {...props.attributes}>{props.children}</ul>,
		'heading-one': (props) => <h1 {...props.attributes}>{props.children}</h1>,
		'heading-two': (props) => <h2 {...props.attributes}>{props.children}</h2>,
		'list-item': (props) => <li {...props.attributes}>{props.children}</li>,
		'numbered-list': (props) => <ol {...props.attributes}>{props.children}</ol>,
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
};

let self;

class TextEditor extends Component {
	constructor(props) {
		super(props);
		self = this;
		this.state = {
		content: State.fromJSON(initialState),
		};
	};

	hasMark(type) {
		const state = this.state.content;
		return state.activeMarks.some((mark) => mark.type == type);
	};

	hasBlock(type) {
		const state = this.state.content;
		return state.blocks.some((node) => node.type == type);
	};

	onChange({ state }) {
		self.setState({ content: state });
	};

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

	onClickMark(e, type) {
		e.preventDefault();
		const state = this.state.content;
		const change = state.change().toggleMark(type);
		this.onChange(change);
	};

	onClickBlock(e, type) {
		e.preventDefault();
		const state = this.state.content;
		const change = state.change();
		const { document } = state;

		if (type != 'bulleted-list' && type != 'numbered-list') {
			const isActive = this.hasBlock(type);
			const isList = this.hasBlock('list-item');

			if (isList) {
				change.setBlock(isActive ? DEFAULT_NODE : type)
				.unwrapBlock('bulleted-list')
				.unwrapBlock('numbered-list');
			} else {
				change.setBlock(isActive ? DEFAULT_NODE : type);
			}
		} else {
			const isList = this.hasBlock('list-item');
			const isType = state.blocks.some((block) => {
			return !!document.getClosest(block.key, (parent) => parent.type == type);
			});

			if (isList && isType) {
				change.setBlock(DEFAULT_NODE)
				.unwrapBlock('bulleted-list')
				.unwrapBlock('numbered-list');
			} else if (isList) {
				change.unwrapBlock(type == 'bulleted-list' ? 'numbered-list' : 'bulleted-list')
				.wrapBlock(type);
			} else {
				change.setBlock('list-item')
				.wrapBlock(type);
			}
		}
		this.onChange(change);
	}

	renderToolbar() {
		return (
			<div className="menu toolbar-menu">
			{this.renderMarkButton('bold', 'format_bold')}
			{this.renderMarkButton('italic', 'format_italic')}
			{this.renderMarkButton('underlined', 'format_underlined')}
			{this.renderMarkButton('code', 'code')}
			{this.renderBlockButton('heading-one', 'looks_one')}
			{this.renderBlockButton('heading-two', 'looks_two')}
			{this.renderBlockButton('block-quote', 'format_quote')}
			{this.renderBlockButton('numbered-list', 'format_list_numbered')}
			{this.renderBlockButton('bulleted-list', 'format_list_bulleted')}
			</div>
		);
	}

	renderMarkButton(type, icon) {
		const isActive = this.hasMark(type);
		const onMouseDown = (e) => this.onClickMark(e, type);

		return (
			<span className="button" onMouseDown={onMouseDown} data-active={isActive}>
			<span className="material-icons">{icon}</span>
			</span>
		);
	}

	renderBlockButton(type, icon) {
		const isActive = this.hasBlock(type);
		const onMouseDown = (e) => this.onClickBlock(e, type);

		return (
			<span className="button" onMouseDown={onMouseDown} data-active={isActive}>
			<span className="material-icons">{icon}</span>
			</span>
		);
	}

	renderEditor() {
		return (
			<div className="editor">
				<Editor
					state={this.state.content}
					onChange={this.onChange}
					onKeyDown={this.onKeyDown}
					schema={schema}
					placeholder={'Enter some rich text...'}
					spellCheck
				/>
			</div>
		);
	}

	render() {
		return (
			<section className="modal">
				{this.renderToolbar()}
				{this.renderEditor()}
			</section>
		);
	}
}

export default TextEditor;
