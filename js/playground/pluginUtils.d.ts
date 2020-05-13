import type { Sandbox } from "typescript-sandbox";
import { Node, DiagnosticRelatedInformation } from "typescript";
import type React from "react";
/** Creates a set of util functions which is exposed to Plugins to make it easier to build consistent UIs */
export declare const createUtils: (sb: any, react: typeof React) => {
    /** Use this to make a few dumb element generation funcs */
    el: (str: string, elementType: string, container: Element) => HTMLElement;
    /** Get a relative URL for something in your dist folder depending on if you're in dev mode or not */
    requireURL: (path: string) => string;
    /** Returns a div which has an interactive AST a TypeScript AST by passing in the root node */
    createASTTree: (node: Node) => HTMLDivElement;
    /** The Gatsby copy of React */
    react: typeof React;
    /**
     * The playground plugin design system. Calling any of the functions will append the
     * element to the container you pass into the first param, and return the HTMLElement
     */
    createDesignSystem: (container: Element) => {
        /** Clear the sidebar */
        clear: () => void;
        /** Present code in a pre > code  */
        code: (code: string) => HTMLElement;
        /** Ideally only use this once, and maybe even prefer using subtitles everywhere */
        title: (title: string) => HTMLElement;
        /** Used to denote sections, give info etc */
        subtitle: (subtitle: string) => HTMLElement;
        p: (subtitle: string) => HTMLElement;
        /** When you can't do something, or have nothing to show */
        showEmptyScreen: (message: string) => HTMLDivElement;
        /**
         * Shows a list of hoverable, and selectable items (errors, highlights etc) which have code representation.
         * The type is quite small, so it should be very feasible for you to massage other data to fit into this function
         */
        listDiags: (sandbox: Sandbox, model: import("monaco-editor").editor.ITextModel, diags: DiagnosticRelatedInformation[]) => HTMLUListElement;
        localStorageOption: (setting: {
            blurb: string;
            flag: string;
            display: string;
        }) => HTMLLIElement;
    };
};
export declare type PluginUtils = ReturnType<typeof createUtils>;
