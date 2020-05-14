define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createUtils = void 0;
    /** Creates a set of util functions which is exposed to Plugins to make it easier to build consistent UIs */
    exports.createUtils = (sb, react) => {
        const sandbox = sb;
        const ts = sandbox.ts;
        const requireURL = (path) => {
            // https://unpkg.com/browse/typescript-playground-presentation-mode@0.0.1/dist/x.js => unpkg/browse/typescript-playground-presentation-mode@0.0.1/dist/x
            const isDev = document.location.host.includes("localhost");
            const prefix = isDev ? "local/" : "unpkg/typescript-playground-presentation-mode/dist/";
            return prefix + path;
        };
        const el = (str, elementType, container) => {
            const el = document.createElement(elementType);
            el.innerHTML = str;
            container.appendChild(el);
            return el;
        };
        // The Playground Plugin design system
        const createDesignSystem = (container) => {
            const clear = () => {
                while (container.firstChild) {
                    container.removeChild(container.firstChild);
                }
            };
            let decorations = [];
            let decorationLock = false;
            return {
                /** Clear the sidebar */
                clear,
                /** Present code in a pre > code  */
                code: (code) => {
                    const createCodePre = document.createElement("pre");
                    const codeElement = document.createElement("code");
                    codeElement.innerHTML = code;
                    createCodePre.appendChild(codeElement);
                    container.appendChild(createCodePre);
                    return codeElement;
                },
                /** Ideally only use this once, and maybe even prefer using subtitles everywhere */
                title: (title) => el(title, "h3", container),
                /** Used to denote sections, give info etc */
                subtitle: (subtitle) => el(subtitle, "h4", container),
                p: (subtitle) => el(subtitle, "p", container),
                /** When you can't do something, or have nothing to show */
                showEmptyScreen: (message) => {
                    clear();
                    const noErrorsMessage = document.createElement("div");
                    noErrorsMessage.id = "empty-message-container";
                    const messageDiv = document.createElement("div");
                    messageDiv.textContent = message;
                    messageDiv.classList.add("empty-plugin-message");
                    noErrorsMessage.appendChild(messageDiv);
                    container.appendChild(noErrorsMessage);
                    return noErrorsMessage;
                },
                /**
                 * Shows a list of hoverable, and selectable items (errors, highlights etc) which have code representation.
                 * The type is quite small, so it should be very feasible for you to massage other data to fit into this function
                 */
                listDiags: (sandbox, model, diags) => {
                    const errorUL = document.createElement("ul");
                    errorUL.className = "compiler-diagnostics";
                    container.appendChild(errorUL);
                    diags.forEach(diag => {
                        const li = document.createElement("li");
                        li.classList.add("diagnostic");
                        switch (diag.category) {
                            case 0:
                                li.classList.add("warning");
                                break;
                            case 1:
                                li.classList.add("error");
                                break;
                            case 2:
                                li.classList.add("suggestion");
                                break;
                            case 3:
                                li.classList.add("message");
                                break;
                        }
                        if (typeof diag === "string") {
                            li.textContent = diag;
                        }
                        else {
                            li.textContent = sandbox.ts.flattenDiagnosticMessageText(diag.messageText, "\n");
                        }
                        errorUL.appendChild(li);
                        li.onmouseenter = () => {
                            if (diag.start && diag.length && !decorationLock) {
                                const start = model.getPositionAt(diag.start);
                                const end = model.getPositionAt(diag.start + diag.length);
                                decorations = sandbox.editor.deltaDecorations(decorations, [
                                    {
                                        range: new sandbox.monaco.Range(start.lineNumber, start.column, end.lineNumber, end.column),
                                        options: { inlineClassName: "error-highlight" },
                                    },
                                ]);
                            }
                        };
                        li.onmouseleave = () => {
                            if (!decorationLock) {
                                sandbox.editor.deltaDecorations(decorations, []);
                            }
                        };
                        li.onclick = () => {
                            if (diag.start && diag.length) {
                                const start = model.getPositionAt(diag.start);
                                sandbox.editor.revealLine(start.lineNumber);
                                const end = model.getPositionAt(diag.start + diag.length);
                                decorations = sandbox.editor.deltaDecorations(decorations, [
                                    {
                                        range: new sandbox.monaco.Range(start.lineNumber, start.column, end.lineNumber, end.column),
                                        options: { inlineClassName: "error-highlight", isWholeLine: true },
                                    },
                                ]);
                                decorationLock = true;
                                setTimeout(() => {
                                    decorationLock = false;
                                    sandbox.editor.deltaDecorations(decorations, []);
                                }, 300);
                            }
                        };
                    });
                    return errorUL;
                },
                localStorageOption: (setting) => {
                    const li = document.createElement("li");
                    const label = document.createElement("label");
                    label.innerHTML = `<span>${setting.display}</span><br/>${setting.blurb}`;
                    const key = setting.flag;
                    const input = document.createElement("input");
                    input.type = "checkbox";
                    input.id = key;
                    input.checked = !!localStorage.getItem(key);
                    input.onchange = () => {
                        if (input.checked) {
                            localStorage.setItem(key, "true");
                        }
                        else {
                            localStorage.removeItem(key);
                        }
                    };
                    label.htmlFor = input.id;
                    li.appendChild(input);
                    li.appendChild(label);
                    container.appendChild(li);
                    return li;
                },
            };
        };
        const createASTTree = (node) => {
            const div = document.createElement("div");
            div.className = "ast";
            const infoForNode = (node) => {
                const name = ts.SyntaxKind[node.kind];
                return {
                    name,
                };
            };
            const renderLiteralField = (key, value) => {
                const li = document.createElement("li");
                li.innerHTML = `${key}: ${value}`;
                return li;
            };
            const renderSingleChild = (key, value) => {
                const li = document.createElement("li");
                li.innerHTML = `${key}: <strong>${ts.SyntaxKind[value.kind]}</strong>`;
                return li;
            };
            const renderManyChildren = (key, value) => {
                const li = document.createElement("li");
                const nodes = value.map(n => "<strong>&nbsp;&nbsp;" + ts.SyntaxKind[n.kind] + "<strong>").join("<br/>");
                li.innerHTML = `${key}: [<br/>${nodes}</br>]`;
                return li;
            };
            const renderItem = (parentElement, node) => {
                const ul = document.createElement("ul");
                parentElement.appendChild(ul);
                ul.className = "ast-tree";
                const info = infoForNode(node);
                const li = document.createElement("li");
                ul.appendChild(li);
                const a = document.createElement("a");
                a.textContent = info.name;
                li.appendChild(a);
                const properties = document.createElement("ul");
                properties.className = "ast-tree";
                li.appendChild(properties);
                Object.keys(node).forEach(field => {
                    if (typeof field === "function")
                        return;
                    if (field === "parent" || field === "flowNode")
                        return;
                    const value = node[field];
                    if (typeof value === "object" && Array.isArray(value) && "pos" in value[0] && "end" in value[0]) {
                        //  Is an array of Nodes
                        properties.appendChild(renderManyChildren(field, value));
                    }
                    else if (typeof value === "object" && "pos" in value && "end" in value) {
                        // Is a single child property
                        properties.appendChild(renderSingleChild(field, value));
                    }
                    else {
                        properties.appendChild(renderLiteralField(field, value));
                    }
                });
            };
            renderItem(div, node);
            return div;
        };
        return {
            /** Use this to make a few dumb element generation funcs */
            el,
            /** Get a relative URL for something in your dist folder depending on if you're in dev mode or not */
            requireURL,
            /** Returns a div which has an interactive AST a TypeScript AST by passing in the root node */
            createASTTree,
            /** The Gatsby copy of React */
            react,
            /**
             * The playground plugin design system. Calling any of the functions will append the
             * element to the container you pass into the first param, and return the HTMLElement
             */
            createDesignSystem,
        };
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGx1Z2luVXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wbGF5Z3JvdW5kL3NyYy9wbHVnaW5VdGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBSUEsNEdBQTRHO0lBQy9GLFFBQUEsV0FBVyxHQUFHLENBQUMsRUFBTyxFQUFFLEtBQW1CLEVBQUUsRUFBRTtRQUMxRCxNQUFNLE9BQU8sR0FBWSxFQUFFLENBQUE7UUFDM0IsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLEVBQUUsQ0FBQTtRQUVyQixNQUFNLFVBQVUsR0FBRyxDQUFDLElBQVksRUFBRSxFQUFFO1lBQ2xDLHdKQUF3SjtZQUN4SixNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUE7WUFDMUQsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLHFEQUFxRCxDQUFBO1lBQ3ZGLE9BQU8sTUFBTSxHQUFHLElBQUksQ0FBQTtRQUN0QixDQUFDLENBQUE7UUFFRCxNQUFNLEVBQUUsR0FBRyxDQUFDLEdBQVcsRUFBRSxXQUFtQixFQUFFLFNBQWtCLEVBQUUsRUFBRTtZQUNsRSxNQUFNLEVBQUUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFBO1lBQzlDLEVBQUUsQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFBO1lBQ2xCLFNBQVMsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUE7WUFDekIsT0FBTyxFQUFFLENBQUE7UUFDWCxDQUFDLENBQUE7UUFFRCxzQ0FBc0M7UUFDdEMsTUFBTSxrQkFBa0IsR0FBRyxDQUFDLFNBQWtCLEVBQUUsRUFBRTtZQUNoRCxNQUFNLEtBQUssR0FBRyxHQUFHLEVBQUU7Z0JBQ2pCLE9BQU8sU0FBUyxDQUFDLFVBQVUsRUFBRTtvQkFDM0IsU0FBUyxDQUFDLFdBQVcsQ0FBQyxT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QTtJQUNILENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgU2FuZGJveCB9IGZyb20gXCJ0eXBlc2NyaXB0LXNhbmRib3hcIlxuaW1wb3J0IHsgTm9kZSwgRGlhZ25vc3RpY1JlbGF0ZWRJbmZvcm1hdGlvbiB9IGZyb20gXCJ0eXBlc2NyaXB0XCJcbmltcG9ydCB0eXBlIFJlYWN0IGZyb20gXCJyZWFjdFwiXG5cbi8qKiBDcmVhdGVzIGEgc2V0IG9mIHV0aWwgZnVuY3Rpb25zIHdoaWNoIGlzIGV4cG9zZWQgdG8gUGx1Z2lucyB0byBtYWtlIGl0IGVhc2llciB0byBidWlsZCBjb25zaXN0ZW50IFVJcyAqL1xuZXhwb3J0IGNvbnN0IGNyZWF0ZVV0aWxzID0gKHNiOiBhbnksIHJlYWN0OiB0eXBlb2YgUmVhY3QpID0+IHtcbiAgY29uc3Qgc2FuZGJveDogU2FuZGJveCA9IHNiXG4gIGNvbnN0IHRzID0gc2FuZGJveC50c1xuXG4gIGNvbnN0IHJlcXVpcmVVUkwgPSAocGF0aDogc3RyaW5nKSA9PiB7XG4gICAgLy8gaHR0cHM6Ly91bnBrZy5jb20vYnJvd3NlL3R5cGVzY3JpcHQtcGxheWdyb3VuZC1wcmVzZW50YXRpb24tbW9kZUAwLjAuMS9kaXN0L3guanMgPT4gdW5wa2cvYnJvd3NlL3R5cGVzY3JpcHQtcGxheWdyb3VuZC1wcmVzZW50YXRpb24tbW9kZUAwLjAuMS9kaXN0L3hcbiAgICBjb25zdCBpc0RldiA9IGRvY3VtZW50LmxvY2F0aW9uLmhvc3QuaW5jbHVkZXMoXCJsb2NhbGhvc3RcIilcbiAgICBjb25zdCBwcmVmaXggPSBpc0RldiA/IFwibG9jYWwvXCIgOiBcInVucGtnL3R5cGVzY3JpcHQtcGxheWdyb3VuZC1wcmVzZW50YXRpb24tbW9kZS9kaXN0L1wiXG4gICAgcmV0dXJuIHByZWZpeCArIHBhdGhcbiAgfVxuXG4gIGNvbnN0IGVsID0gKHN0cjogc3RyaW5nLCBlbGVtZW50VHlwZTogc3RyaW5nLCBjb250YWluZXI6IEVsZW1lbnQpID0+IHtcbiAgICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZWxlbWVudFR5cGUpXG4gICAgZWwuaW5uZXJIVE1MID0gc3RyXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGVsKVxuICAgIHJldHVybiBlbFxuICB9XG5cbiAgLy8gVGhlIFBsYXlncm91bmQgUGx1Z2luIGRlc2lnbiBzeXN0ZW1cbiAgY29uc3QgY3JlYXRlRGVzaWduU3lzdGVtID0gKGNvbnRhaW5lcjogRWxlbWVudCkgPT4ge1xuICAgIGNvbnN0IGNsZWFyID0gKCkgPT4ge1xuICAgICAgd2hpbGUgKGNvbnRhaW5lci5maXJzdENoaWxkKSB7XG4gICAgICAgIGNvbnRhaW5lci5yZW1vdmVDaGlsZChjb250YWluZXIuZmlyc3RDaGlsZClcbiAgICAgIH1cbiAgICB9XG4gICAgbGV0IGRlY29yYXRpb25zOiBzdHJpbmdbXSA9IFtdXG4gICAgbGV0IGRlY29yYXRpb25Mb2NrID0gZmFsc2VcblxuICAgIHJldHVybiB7XG4gICAgICAvKiogQ2xlYXIgdGhlIHNpZGViYXIgKi9cbiAgICAgIGNsZWFyLFxuICAgICAgLyoqIFByZXNlbnQgY29kZSBpbiBhIHByZSA+IGNvZGUgICovXG4gICAgICBjb2RlOiAoY29kZTogc3RyaW5nKSA9PiB7XG4gICAgICAgIGNvbnN0IGNyZWF0ZUNvZGVQcmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicHJlXCIpXG4gICAgICAgIGNvbnN0IGNvZGVFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNvZGVcIilcblxuICAgICAgICBjb2RlRWxlbWVudC5pbm5lckhUTUwgPSBjb2RlXG5cbiAgICAgICAgY3JlYXRlQ29kZVByZS5hcHBlbmRDaGlsZChjb2RlRWxlbWVudClcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGNyZWF0ZUNvZGVQcmUpXG5cbiAgICAgICAgcmV0dXJuIGNvZGVFbGVtZW50XG4gICAgICB9LFxuICAgICAgLyoqIElkZWFsbHkgb25seSB1c2UgdGhpcyBvbmNlLCBhbmQgbWF5YmUgZXZlbiBwcmVmZXIgdXNpbmcgc3VidGl0bGVzIGV2ZXJ5d2hlcmUgKi9cbiAgICAgIHRpdGxlOiAodGl0bGU6IHN0cmluZykgPT4gZWwodGl0bGUsIFwiaDNcIiwgY29udGFpbmVyKSxcbiAgICAgIC8qKiBVc2VkIHRvIGRlbm90ZSBzZWN0aW9ucywgZ2l2ZSBpbmZvIGV0YyAqL1xuICAgICAgc3VidGl0bGU6IChzdWJ0aXRsZTogc3RyaW5nKSA9PiBlbChzdWJ0aXRsZSwgXCJoNFwiLCBjb250YWluZXIpLFxuICAgICAgcDogKHN1YnRpdGxlOiBzdHJpbmcpID0+IGVsKHN1YnRpdGxlLCBcInBcIiwgY29udGFpbmVyKSxcbiAgICAgIC8qKiBXaGVuIHlvdSBjYW4ndCBkbyBzb21ldGhpbmcsIG9yIGhhdmUgbm90aGluZyB0byBzaG93ICovXG4gICAgICBzaG93RW1wdHlTY3JlZW46IChtZXNzYWdlOiBzdHJpbmcpID0+IHtcbiAgICAgICAgY2xlYXIoKVxuXG4gICAgICAgIGNvbnN0IG5vRXJyb3JzTWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcbiAgICAgICAgbm9FcnJvcnNNZXNzYWdlLmlkID0gXCJlbXB0eS1tZXNzYWdlLWNvbnRhaW5lclwiXG5cbiAgICAgICAgY29uc3QgbWVzc2FnZURpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcbiAgICAgICAgbWVzc2FnZURpdi50ZXh0Q29udGVudCA9IG1lc3NhZ2VcbiAgICAgICAgbWVzc2FnZURpdi5jbGFzc0xpc3QuYWRkKFwiZW1wdHktcGx1Z2luLW1lc3NhZ2VcIilcbiAgICAgICAgbm9FcnJvcnNNZXNzYWdlLmFwcGVuZENoaWxkKG1lc3NhZ2VEaXYpXG5cbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKG5vRXJyb3JzTWVzc2FnZSlcbiAgICAgICAgcmV0dXJuIG5vRXJyb3JzTWVzc2FnZVxuICAgICAgfSxcbiAgICAgIC8qKlxuICAgICAgICogU2hvd3MgYSBsaXN0IG9mIGhvdmVyYWJsZSwgYW5kIHNlbGVjdGFibGUgaXRlbXMgKGVycm9ycywgaGlnaGxpZ2h0cyBldGMpIHdoaWNoIGhhdmUgY29kZSByZXByZXNlbnRhdGlvbi5cbiAgICAgICAqIFRoZSB0eXBlIGlzIHF1aXRlIHNtYWxsLCBzbyBpdCBzaG91bGQgYmUgdmVyeSBmZWFzaWJsZSBmb3IgeW91IHRvIG1hc3NhZ2Ugb3RoZXIgZGF0YSB0byBmaXQgaW50byB0aGlzIGZ1bmN0aW9uXG4gICAgICAgKi9cbiAgICAgIGxpc3REaWFnczogKFxuICAgICAgICBzYW5kYm94OiBTYW5kYm94LFxuICAgICAgICBtb2RlbDogaW1wb3J0KFwibW9uYWNvLWVkaXRvclwiKS5lZGl0b3IuSVRleHRNb2RlbCxcbiAgICAgICAgZGlhZ3M6IERpYWdub3N0aWNSZWxhdGVkSW5mb3JtYXRpb25bXVxuICAgICAgKSA9PiB7XG4gICAgICAgIGNvbnN0IGVycm9yVUwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidWxcIilcbiAgICAgICAgZXJyb3JVTC5jbGFzc05hbWUgPSBcImNvbXBpbGVyLWRpYWdub3N0aWNzXCJcblxuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZXJyb3JVTClcblxuICAgICAgICBkaWFncy5mb3JFYWNoKGRpYWcgPT4ge1xuICAgICAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpXG4gICAgICAgICAgbGkuY2xhc3NMaXN0LmFkZChcImRpYWdub3N0aWNcIilcbiAgICAgICAgICBzd2l0Y2ggKGRpYWcuY2F0ZWdvcnkpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgbGkuY2xhc3NMaXN0LmFkZChcIndhcm5pbmdcIilcbiAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgbGkuY2xhc3NMaXN0LmFkZChcImVycm9yXCIpXG4gICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgIGxpLmNsYXNzTGlzdC5hZGQoXCJzdWdnZXN0aW9uXCIpXG4gICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgIGxpLmNsYXNzTGlzdC5hZGQoXCJtZXNzYWdlXCIpXG4gICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHR5cGVvZiBkaWFnID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBsaS50ZXh0Q29udGVudCA9IGRpYWdcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGkudGV4dENvbnRlbnQgPSBzYW5kYm94LnRzLmZsYXR0ZW5EaWFnbm9zdGljTWVzc2FnZVRleHQoZGlhZy5tZXNzYWdlVGV4dCwgXCJcXG5cIilcbiAgICAgICAgICB9XG4gICAgICAgICAgZXJyb3JVTC5hcHBlbmRDaGlsZChsaSlcblxuICAgICAgICAgIGxpLm9ubW91c2VlbnRlciA9ICgpID0+IHtcbiAgICAgICAgICAgIGlmIChkaWFnLnN0YXJ0ICYmIGRpYWcubGVuZ3RoICYmICFkZWNvcmF0aW9uTG9jaykge1xuICAgICAgICAgICAgICBjb25zdCBzdGFydCA9IG1vZGVsLmdldFBvc2l0aW9uQXQoZGlhZy5zdGFydClcbiAgICAgICAgICAgICAgY29uc3QgZW5kID0gbW9kZWwuZ2V0UG9zaXRpb25BdChkaWFnLnN0YXJ0ICsgZGlhZy5sZW5ndGgpXG4gICAgICAgICAgICAgIGRlY29yYXRpb25zID0gc2FuZGJveC5lZGl0b3IuZGVsdGFEZWNvcmF0aW9ucyhkZWNvcmF0aW9ucywgW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHJhbmdlOiBuZXcgc2FuZGJveC5tb25hY28uUmFuZ2Uoc3RhcnQubGluZU51bWJlciwgc3RhcnQuY29sdW1uLCBlbmQubGluZU51bWJlciwgZW5kLmNvbHVtbiksXG4gICAgICAgICAgICAgICAgICBvcHRpb25zOiB7IGlubGluZUNsYXNzTmFtZTogXCJlcnJvci1oaWdobGlnaHRcIiB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbGkub25tb3VzZWxlYXZlID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKCFkZWNvcmF0aW9uTG9jaykge1xuICAgICAgICAgICAgICBzYW5kYm94LmVkaXRvci5kZWx0YURlY29yYXRpb25zKGRlY29yYXRpb25zLCBbXSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBsaS5vbmNsaWNrID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKGRpYWcuc3RhcnQgJiYgZGlhZy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgY29uc3Qgc3RhcnQgPSBtb2RlbC5nZXRQb3NpdGlvbkF0KGRpYWcuc3RhcnQpXG4gICAgICAgICAgICAgIHNhbmRib3guZWRpdG9yLnJldmVhbExpbmUoc3RhcnQubGluZU51bWJlcilcblxuICAgICAgICAgICAgICBjb25zdCBlbmQgPSBtb2RlbC5nZXRQb3NpdGlvbkF0KGRpYWcuc3RhcnQgKyBkaWFnLmxlbmd0aClcbiAgICAgICAgICAgICAgZGVjb3JhdGlvbnMgPSBzYW5kYm94LmVkaXRvci5kZWx0YURlY29yYXRpb25zKGRlY29yYXRpb25zLCBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgcmFuZ2U6IG5ldyBzYW5kYm94Lm1vbmFjby5SYW5nZShzdGFydC5saW5lTnVtYmVyLCBzdGFydC5jb2x1bW4sIGVuZC5saW5lTnVtYmVyLCBlbmQuY29sdW1uKSxcbiAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHsgaW5saW5lQ2xhc3NOYW1lOiBcImVycm9yLWhpZ2hsaWdodFwiLCBpc1dob2xlTGluZTogdHJ1ZSB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0pXG5cbiAgICAgICAgICAgICAgZGVjb3JhdGlvbkxvY2sgPSB0cnVlXG4gICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGRlY29yYXRpb25Mb2NrID0gZmFsc2VcbiAgICAgICAgICAgICAgICBzYW5kYm94LmVkaXRvci5kZWx0YURlY29yYXRpb25zKGRlY29yYXRpb25zLCBbXSlcbiAgICAgICAgICAgICAgfSwgMzAwKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIGVycm9yVUxcbiAgICAgIH0sXG5cbiAgICAgIGxvY2FsU3RvcmFnZU9wdGlvbjogKHNldHRpbmc6IHsgYmx1cmI6IHN0cmluZzsgZmxhZzogc3RyaW5nOyBkaXNwbGF5OiBzdHJpbmcgfSkgPT4ge1xuICAgICAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKVxuICAgICAgICBjb25zdCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKVxuICAgICAgICBsYWJlbC5pbm5lckhUTUwgPSBgPHNwYW4+JHtzZXR0aW5nLmRpc3BsYXl9PC9zcGFuPjxici8+JHtzZXR0aW5nLmJsdXJifWBcblxuICAgICAgICBjb25zdCBrZXkgPSBzZXR0aW5nLmZsYWdcbiAgICAgICAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIilcbiAgICAgICAgaW5wdXQudHlwZSA9IFwiY2hlY2tib3hcIlxuICAgICAgICBpbnB1dC5pZCA9IGtleVxuICAgICAgICBpbnB1dC5jaGVja2VkID0gISFsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpXG5cbiAgICAgICAgaW5wdXQub25jaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgICAgaWYgKGlucHV0LmNoZWNrZWQpIHtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgXCJ0cnVlXCIpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGtleSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsYWJlbC5odG1sRm9yID0gaW5wdXQuaWRcblxuICAgICAgICBsaS5hcHBlbmRDaGlsZChpbnB1dClcbiAgICAgICAgbGkuYXBwZW5kQ2hpbGQobGFiZWwpXG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChsaSlcbiAgICAgICAgcmV0dXJuIGxpXG4gICAgICB9LFxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGNyZWF0ZUFTVFRyZWUgPSAobm9kZTogTm9kZSkgPT4ge1xuICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcbiAgICBkaXYuY2xhc3NOYW1lID0gXCJhc3RcIlxuXG4gICAgY29uc3QgaW5mb0Zvck5vZGUgPSAobm9kZTogTm9kZSkgPT4ge1xuICAgICAgY29uc3QgbmFtZSA9IHRzLlN5bnRheEtpbmRbbm9kZS5raW5kXVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZSxcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCByZW5kZXJMaXRlcmFsRmllbGQgPSAoa2V5OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpID0+IHtcbiAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpXG4gICAgICBsaS5pbm5lckhUTUwgPSBgJHtrZXl9OiAke3ZhbHVlfWBcbiAgICAgIHJldHVybiBsaVxuICAgIH1cblxuICAgIGNvbnN0IHJlbmRlclNpbmdsZUNoaWxkID0gKGtleTogc3RyaW5nLCB2YWx1ZTogTm9kZSkgPT4ge1xuICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIilcbiAgICAgIGxpLmlubmVySFRNTCA9IGAke2tleX06IDxzdHJvbmc+JHt0cy5TeW50YXhLaW5kW3ZhbHVlLmtpbmRdfTwvc3Ryb25nPmBcbiAgICAgIHJldHVybiBsaVxuICAgIH1cblxuICAgIGNvbnN0IHJlbmRlck1hbnlDaGlsZHJlbiA9IChrZXk6IHN0cmluZywgdmFsdWU6IE5vZGVbXSkgPT4ge1xuICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIilcbiAgICAgIGNvbnN0IG5vZGVzID0gdmFsdWUubWFwKG4gPT4gXCI8c3Ryb25nPiZuYnNwOyZuYnNwO1wiICsgdHMuU3ludGF4S2luZFtuLmtpbmRdICsgXCI8c3Ryb25nPlwiKS5qb2luKFwiPGJyLz5cIilcbiAgICAgIGxpLmlubmVySFRNTCA9IGAke2tleX06IFs8YnIvPiR7bm9kZXN9PC9icj5dYFxuICAgICAgcmV0dXJuIGxpXG4gICAgfVxuXG4gICAgY29uc3QgcmVuZGVySXRlbSA9IChwYXJlbnRFbGVtZW50OiBFbGVtZW50LCBub2RlOiBOb2RlKSA9PiB7XG4gICAgICBjb25zdCB1bCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiKVxuICAgICAgcGFyZW50RWxlbWVudC5hcHBlbmRDaGlsZCh1bClcbiAgICAgIHVsLmNsYXNzTmFtZSA9IFwiYXN0LXRyZWVcIlxuXG4gICAgICBjb25zdCBpbmZvID0gaW5mb0Zvck5vZGUobm9kZSlcblxuICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIilcbiAgICAgIHVsLmFwcGVuZENoaWxkKGxpKVxuXG4gICAgICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIilcbiAgICAgIGEudGV4dENvbnRlbnQgPSBpbmZvLm5hbWVcbiAgICAgIGxpLmFwcGVuZENoaWxkKGEpXG5cbiAgICAgIGNvbnN0IHByb3BlcnRpZXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidWxcIilcbiAgICAgIHByb3BlcnRpZXMuY2xhc3NOYW1lID0gXCJhc3QtdHJlZVwiXG4gICAgICBsaS5hcHBlbmRDaGlsZChwcm9wZXJ0aWVzKVxuXG4gICAgICBPYmplY3Qua2V5cyhub2RlKS5mb3JFYWNoKGZpZWxkID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiBmaWVsZCA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm5cbiAgICAgICAgaWYgKGZpZWxkID09PSBcInBhcmVudFwiIHx8IGZpZWxkID09PSBcImZsb3dOb2RlXCIpIHJldHVyblxuXG4gICAgICAgIGNvbnN0IHZhbHVlID0gKG5vZGUgYXMgYW55KVtmaWVsZF1cbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJiBBcnJheS5pc0FycmF5KHZhbHVlKSAmJiBcInBvc1wiIGluIHZhbHVlWzBdICYmIFwiZW5kXCIgaW4gdmFsdWVbMF0pIHtcbiAgICAgICAgICAvLyAgSXMgYW4gYXJyYXkgb2YgTm9kZXNcbiAgICAgICAgICBwcm9wZXJ0aWVzLmFwcGVuZENoaWxkKHJlbmRlck1hbnlDaGlsZHJlbihmaWVsZCwgdmFsdWUpKVxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJiBcInBvc1wiIGluIHZhbHVlICYmIFwiZW5kXCIgaW4gdmFsdWUpIHtcbiAgICAgICAgICAvLyBJcyBhIHNpbmdsZSBjaGlsZCBwcm9wZXJ0eVxuICAgICAgICAgIHByb3BlcnRpZXMuYXBwZW5kQ2hpbGQocmVuZGVyU2luZ2xlQ2hpbGQoZmllbGQsIHZhbHVlKSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwcm9wZXJ0aWVzLmFwcGVuZENoaWxkKHJlbmRlckxpdGVyYWxGaWVsZChmaWVsZCwgdmFsdWUpKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIHJlbmRlckl0ZW0oZGl2LCBub2RlKVxuICAgIHJldHVybiBkaXZcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgLyoqIFVzZSB0aGlzIHRvIG1ha2UgYSBmZXcgZHVtYiBlbGVtZW50IGdlbmVyYXRpb24gZnVuY3MgKi9cbiAgICBlbCxcbiAgICAvKiogR2V0IGEgcmVsYXRpdmUgVVJMIGZvciBzb21ldGhpbmcgaW4geW91ciBkaXN0IGZvbGRlciBkZXBlbmRpbmcgb24gaWYgeW91J3JlIGluIGRldiBtb2RlIG9yIG5vdCAqL1xuICAgIHJlcXVpcmVVUkwsXG4gICAgLyoqIFJldHVybnMgYSBkaXYgd2hpY2ggaGFzIGFuIGludGVyYWN0aXZlIEFTVCBhIFR5cGVTY3JpcHQgQVNUIGJ5IHBhc3NpbmcgaW4gdGhlIHJvb3Qgbm9kZSAqL1xuICAgIGNyZWF0ZUFTVFRyZWUsXG4gICAgLyoqIFRoZSBHYXRzYnkgY29weSBvZiBSZWFjdCAqL1xuICAgIHJlYWN0LFxuICAgIC8qKlxuICAgICAqIFRoZSBwbGF5Z3JvdW5kIHBsdWdpbiBkZXNpZ24gc3lzdGVtLiBDYWxsaW5nIGFueSBvZiB0aGUgZnVuY3Rpb25zIHdpbGwgYXBwZW5kIHRoZVxuICAgICAqIGVsZW1lbnQgdG8gdGhlIGNvbnRhaW5lciB5b3UgcGFzcyBpbnRvIHRoZSBmaXJzdCBwYXJhbSwgYW5kIHJldHVybiB0aGUgSFRNTEVsZW1lbnRcbiAgICAgKi9cbiAgICBjcmVhdGVEZXNpZ25TeXN0ZW0sXG4gIH1cbn1cblxuZXhwb3J0IHR5cGUgUGx1Z2luVXRpbHMgPSBSZXR1cm5UeXBlPHR5cGVvZiBjcmVhdGVVdGlscz5cbiJdfQ==