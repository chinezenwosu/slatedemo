import React from 'react';
import { Editor, Raw } from 'slate';
import MarkHotKey from './MarkHotKey';

const plugins = [
  MarkHotKey({ code: 66, type: 'bold' }),
  MarkHotKey({ code: 67, type: 'code', isAltKey: true }),
  MarkHotKey({ code: 73, type: 'italic' }),
  MarkHotKey({ code: 68, type: 'strikethrough' }),
  MarkHotKey({ code: 85, type: 'underline' }),
]

class App extends React.Component {
    constructor(props) {
        super();

        let initialState = Raw.deserialize({
            nodes: [
                {
                    kind: 'block',
                    type: 'paragraph',
                    nodes: [
                        {
                            kind: 'text',
                            text: 'A line of text in a paragraph.',
                        },
                    ],
                },
            ],
        }, { terse: true });

        console.log(initialState)

        this.state = {
            state: initialState,
            schema: {
                nodes: {
                    code: this.CodeNode
                },
                // Add our "bold" mark to the schema...
                marks: {
                    bold: this.BoldMark
                }
            }
        };

        this.onChange = this.onChange.bind(this)
    }

    CodeNode(props) {
        return <pre {...props.attributes}><code>{props.children}</code></pre>
    }

    BoldMark(props) {
        return <strong>{props.children}</strong>
    }

    // On change, update the app's React state with the new editor state.
    onChange({ state }) {
        this.setState({ state });
    }

    // Render the editor.
    render() {
        return (
            <Editor
                schema={this.state.schema}
                plugins={plugins}
                state={this.state.state}
                onChange={this.onChange}
            />
        );
    }
};

export default App;
