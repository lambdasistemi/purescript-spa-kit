import * as React from "react";

import { basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import {
  HighlightStyle,
  StreamLanguage,
  bracketMatching,
  syntaxHighlighting,
} from "@codemirror/language";
import { tags } from "@lezer/highlight";

const keywords = new Set([
  "program",
  "lam",
  "delay",
  "force",
  "con",
  "builtin",
  "error",
  "constr",
  "case",
]);

const types = new Set([
  "integer",
  "bytestring",
  "string",
  "bool",
  "unit",
  "list",
  "pair",
  "data",
]);

const uplcLanguage = StreamLanguage.define({
  token(stream) {
    if (stream.eatSpace()) return null;
    if (stream.match(/--.*/)) return "comment";
    if (stream.match(/[()[\]]/)) return "bracket";
    if (stream.match(/-?[0-9]+(?:\.[0-9]+)*/)) return "number";
    if (stream.match(/"([^"\\]|\\.)*"/)) return "string";
    if (stream.match(/#[0-9a-fA-F]*/)) return "atom";

    const word = stream.match(/[A-Za-z_][A-Za-z0-9_']*/);
    if (word) {
      const value = word[0];
      if (keywords.has(value)) return "keyword";
      if (types.has(value)) return "type";
      return "variableName";
    }

    stream.next();
    return null;
  },
});

const uplcHighlight = HighlightStyle.define([
  { tag: tags.keyword, color: "#255f85", fontWeight: "600" },
  { tag: tags.typeName, color: "#7a4f27", fontWeight: "600" },
  { tag: tags.number, color: "#2f6f50" },
  { tag: tags.string, color: "#7a3f8f" },
  { tag: tags.comment, color: "#667085", fontStyle: "italic" },
  { tag: tags.variableName, color: "#111827" },
]);

const editorTheme = EditorView.theme({
  "&": {
    height: "100%",
    minHeight: "420px",
    background: "#fbfcfe",
    color: "#111827",
  },
  ".cm-scroller": {
    minHeight: "420px",
    fontFamily:
      "ui-monospace, SFMono-Regular, Menlo, Consolas, Liberation Mono, monospace",
    fontSize: "0.94rem",
    lineHeight: "1.5",
  },
  ".cm-content": {
    padding: "16px 0",
  },
  ".cm-line": {
    padding: "0 16px",
  },
  ".cm-gutters": {
    background: "#f3f6fa",
    borderRight: "1px solid #d8dee6",
  },
});

export const codeEditor = (props) => {
  const hostRef = React.useRef(null);
  const viewRef = React.useRef(null);
  const onChangeRef = React.useRef(props.onChange);
  onChangeRef.current = props.onChange;

  React.useEffect(() => {
    const state = EditorState.create({
      doc: props.value,
      extensions: [
        basicSetup,
        bracketMatching(),
        uplcLanguage,
        syntaxHighlighting(uplcHighlight),
        editorTheme,
        EditorView.contentAttributes.of({
          "aria-label": props.ariaLabel || "UPLC program",
          spellcheck: "false",
        }),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChangeRef.current(update.state.doc.toString())();
          }
        }),
      ],
    });
    const view = new EditorView({ state, parent: hostRef.current });
    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, []);

  React.useEffect(() => {
    const view = viewRef.current;
    const next = props.value ?? "";
    if (view && view.state.doc.toString() !== next) {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: next },
      });
    }
  }, [props.value]);

  return React.createElement("div", {
    className: "spa-kit-code-editor",
    ref: hostRef,
    style: { height: "100%" },
  });
};

