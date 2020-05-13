define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.optionsPlugin = exports.addCustomPlugin = exports.activePlugins = exports.allowConnectingToLocalhost = void 0;
    const pluginRegistry = [
        {
            module: "typescript-playground-presentation-mode",
            display: "Presentation Mode",
            blurb: "Create presentations inside the TypeScript playground, seamlessly jump between slides and live-code.",
            repo: "https://github.com/orta/playground-slides/#README",
            author: {
                name: "Orta",
                href: "https://orta.io",
            },
        },
    ];
    /** Whether the playground should actively reach out to an existing plugin */
    exports.allowConnectingToLocalhost = () => {
        return !!localStorage.getItem("compiler-setting-connect-dev-plugin");
    };
    exports.activePlugins = () => {
        const existing = customPlugins().map(module => ({ module }));
        return existing.concat(pluginRegistry.filter(p => !!localStorage.getItem("plugin-" + p.module)));
    };
    const removeCustomPlugins = (mod) => {
        const newPlugins = customPlugins().filter(p => p !== mod);
        localStorage.setItem("custom-plugins-playground", JSON.stringify(newPlugins));
    };
    exports.addCustomPlugin = (mod) => {
        const newPlugins = customPlugins();
        newPlugins.push(mod);
        localStorage.setItem("custom-plugins-playground", JSON.stringify(newPlugins));
        // @ts-ignore
        window.appInsights &&
            // @ts-ignore
            window.appInsights.trackEvent({ name: "Added Custom Module", properties: { id: mod } });
    };
    const customPlugins = () => {
        return JSON.parse(localStorage.getItem("custom-plugins-playground") || "[]");
    };
    exports.optionsPlugin = (i, utils) => {
        const plugin = {
            id: "plugins",
            displayName: i("play_sidebar_plugins"),
            // shouldBeSelected: () => true, // uncomment to make this the first tab on reloads
            willMount: (_sandbox, container) => {
                const ds = utils.createDesignSystem(container);
                const restartReq = ds.p(i("play_sidebar_options_restart_required"));
                restartReq.id = "restart-required";
                ds.subtitle(i("play_sidebar_plugins_options_external"));
                const pluginsOL = document.createElement("ol");
                pluginsOL.className = "playground-plugins";
                pluginRegistry.forEach(plugin => {
                    const settingButton = createPlugin(plugin);
                    pluginsOL.appendChild(settingButton);
                });
                container.appendChild(pluginsOL);
                const warning = document.createElement("p");
                warning.className = "warning";
                warning.textContent = i("play_sidebar_plugins_options_external_warning");
                container.appendChild(warning);
                ds.subtitle(i("play_sidebar_plugins_options_modules"));
                const customModulesOL = document.createElement("ol");
                customModulesOL.className = "custom-modules";
                const updateCustomModules = () => {
                    while (customModulesOL.firstChild) {
                        customModulesOL.removeChild(customModulesOL.firstChild);
                    }
                    customPlugins().forEach(module => {
                        const li = document.createElement("li");
                        li.innerHTML = module;
                        const a = document.createElement("a");
                        a.href = "#";
                        a.textContent = "X";
                        a.onclick = () => {
                            removeCustomPlugins(module);
                            updateCustomModules();
                            announceWeNeedARestart();
                            return false;
                        };
                        li.appendChild(a);
                        customModulesOL.appendChild(li);
                    });
                };
                updateCustomModules();
                container.appendChild(customModulesOL);
                const inputForm = createNewModuleInputForm(updateCustomModules, i);
                container.appendChild(inputForm);
                ds.subtitle(i("play_sidebar_plugins_plugin_dev"));
                const pluginsDevOL = document.createElement("ol");
                pluginsDevOL.className = "playground-options";
                const connectToDev = ds.localStorageOption({
                    display: i("play_sidebar_plugins_plugin_dev_option"),
                    blurb: i("play_sidebar_plugins_plugin_dev_copy"),
                    flag: "connect-dev-plugin",
                });
                pluginsDevOL.appendChild(connectToDev);
                container.appendChild(pluginsDevOL);
                // createSection(i("play_sidebar_options"), categoryDiv)
                // settings.forEach(setting => {
                //   const settingButton = createButton(setting)
                //   ol.appendChild(settingButton)
                // })
                // categoryDiv.appendChild(ol)
            },
        };
        return plugin;
    };
    const announceWeNeedARestart = () => {
        document.getElementById("restart-required").style.display = "block";
    };
    const createSection = (title, container) => {
        const pluginDevTitle = document.createElement("h4");
        pluginDevTitle.textContent = title;
        container.appendChild(pluginDevTitle);
    };
    const createPlugin = (plugin) => {
        const li = document.createElement("li");
        const div = document.createElement("div");
        const label = document.createElement("label");
        const top = `<span>${plugin.display}</span> by <a href='${plugin.author.href}'>${plugin.author.name}</a><br/>${plugin.blurb}`;
        const bottom = `<a href='https://www.npmjs.com/package/${plugin.module}'>npm</a> | <a href="${plugin.repo}">repo</a>`;
        label.innerHTML = `${top}<br/>${bottom}`;
        const key = "plugin-" + plugin.module;
        const input = document.createElement("input");
        input.type = "checkbox";
        input.id = key;
        input.checked = !!localStorage.getItem(key);
        input.onchange = () => {
            announceWeNeedARestart();
            if (input.checked) {
                // @ts-ignore
                window.appInsights &&
                    // @ts-ignore
                    window.appInsights.trackEvent({ name: "Added Registry Plugin", properties: { id: key } });
                localStorage.setItem(key, "true");
            }
            else {
                localStorage.removeItem(key);
            }
        };
        label.htmlFor = input.id;
        div.appendChild(input);
        div.appendChild(label);
        li.appendChild(div);
        return li;
    };
    const createNewModuleInputForm = (updateOL, i) => {
        const form = document.createElement("form");
        const newModuleInput = document.createElement("input");
        newModuleInput.type = "text";
        newModuleInput.id = "gist-input";
        newModuleInput.placeholder = i("play_sidebar_plugins_options_modules_placeholder");
        form.appendChild(newModuleInput);
        form.onsubmit = e => {
            announceWeNeedARestart();
            exports.addCustomPlugin(newModuleInput.value);
            e.stopPropagation();
            updateOL();
            return false;
        };
        return form;
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGx1Z2lucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BsYXlncm91bmQvc3JjL3NpZGViYXIvcGx1Z2lucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBRUEsTUFBTSxjQUFjLEdBQUc7UUFDckI7WUFDRSxNQUFNLEVBQUUseUNBQXlDO1lBQ2pELE9BQU8sRUFBRSxtQkFBbUI7WUFDNUIsS0FBSyxFQUFFLHNHQUFzRztZQUM3RyxJQUFJLEVBQUUsbURBQW1EO1lBQ3pELE1BQU0sRUFBRTtnQkFDTixJQUFJLEVBQUUsTUFBTTtnQkFDWixJQUFJLEVBQUUsaUJBQWlCO2FBQ3hCO1NBQ0Y7S0FDRixDQUFBO0lBRUQsNkVBQTZFO0lBQ2hFLFFBQUEsMEJBQTBCLEdBQUcsR0FBRyxFQUFFO1FBQzdDLE9BQU8sQ0FBQyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMscUNBQXFDLENBQUMsQ0FBQTtJQUN0RSxDQUFDLENBQUE7SUFFWSxRQUFBLGFBQWEsR0FBRyxHQUFHLEVBQUU7UUFDaEMsTUFBTSxRQUFRLEdBQUcsYUFBYSxFQUFFLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUM1RCxPQUFPLFFBQVEsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ2xHLENBQUMsQ0FBQTtJQUVELE1BQU0sbUJBQW1CLEdBQUcsQ0FBQyxHQUFXLEVBQUUsRUFBRTtRQUMxQyxNQUFNLFVBQVUsR0FBRyxhQUFhLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUE7UUFDekQsWUFBWSxDQUFDLE9B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QyxDQUFBO1FBQ3RCLEdBQUcsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDdEIsRUFBRSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNuQixPQUFPLEVBQUUsQ0FBQTtJQUNYLENBQUMsQ0FBQTtJQUVELE1BQU0sd0JBQXdCLEdBQUcsQ0FBQyxRQUFrQixFQUFFLENBQU0sRUFBRSxFQUFFO1FBQzlELE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUE7UUFFM0MsTUFBTSxjQUFjLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUN0RCxjQUFjLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQTtRQUM1QixjQUFjLENBQUMsRUFBRSxHQUFHLFlBQVksQ0FBQTtRQUNoQyxjQUFjLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxrREFBa0QsQ0FBQyxDQUFBO1FBQ2xGLElBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUE7UUFFaEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsRUFBRTtZQUNsQixzQkFBc0IsRUFBRSxDQUFBO1lBQ3hCLHVCQUFlLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFBO1lBQ3JDLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQTtZQUNuQixRQUFRLEVBQUUsQ0FBQTtZQUNWLE9BQU8sS0FBSyxDQUFBO1FBQ2QsQ0FBQyxDQUFBO1FBRUQsT0FBTyxJQUFJLENBQUE7SUFDYixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQbGF5Z3JvdW5kUGx1Z2luLCBQbHVnaW5GYWN0b3J5IH0gZnJvbSBcIi4uXCJcblxuY29uc3QgcGx1Z2luUmVnaXN0cnkgPSBbXG4gIHtcbiAgICBtb2R1bGU6IFwidHlwZXNjcmlwdC1wbGF5Z3JvdW5kLXByZXNlbnRhdGlvbi1tb2RlXCIsXG4gICAgZGlzcGxheTogXCJQcmVzZW50YXRpb24gTW9kZVwiLFxuICAgIGJsdXJiOiBcIkNyZWF0ZSBwcmVzZW50YXRpb25zIGluc2lkZSB0aGUgVHlwZVNjcmlwdCBwbGF5Z3JvdW5kLCBzZWFtbGVzc2x5IGp1bXAgYmV0d2VlbiBzbGlkZXMgYW5kIGxpdmUtY29kZS5cIixcbiAgICByZXBvOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9vcnRhL3BsYXlncm91bmQtc2xpZGVzLyNSRUFETUVcIixcbiAgICBhdXRob3I6IHtcbiAgICAgIG5hbWU6IFwiT3J0YVwiLFxuICAgICAgaHJlZjogXCJodHRwczovL29ydGEuaW9cIixcbiAgICB9LFxuICB9LFxuXVxuXG4vKiogV2hldGhlciB0aGUgcGxheWdyb3VuZCBzaG91bGQgYWN0aXZlbHkgcmVhY2ggb3V0IHRvIGFuIGV4aXN0aW5nIHBsdWdpbiAqL1xuZXhwb3J0IGNvbnN0IGFsbG93Q29ubmVjdGluZ1RvTG9jYWxob3N0ID0gKCkgPT4ge1xuICByZXR1cm4gISFsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImNvbXBpbGVyLXNldHRpbmctY29ubmVjdC1kZXYtcGx1Z2luXCIpXG59XG5cbmV4cG9ydCBjb25zdCBhY3RpdmVQbHVnaW5zID0gKCkgPT4ge1xuICBjb25zdCBleGlzdGluZyA9IGN1c3RvbVBsdWdpbnMoKS5tYXAobW9kdWxlID0+ICh7IG1vZHVsZSB9KSlcbiAgcmV0dXJuIGV4aXN0aW5nLmNvbmNhdChwbHVnaW5SZWdpc3RyeS5maWx0ZXIocCA9PiAhIWxvY2FsU3RvcmFnZS5nZXRJdGVtKFwicGx1Z2luLVwiICsgcC5tb2R1bGUpKSlcbn1cblxuY29uc3QgcmVtb3ZlQ3VzdG9tUGx1Z2lucyA9IChtb2Q6IHN0cmluZykgPT4ge1xuICBjb25zdCBuZXdQbHVnaW5zID0gY3VzdG9tUGx1Z2lucygpLmZpbHRlcihwID0+IHAgIT09IG1vZClcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJjdXN0b20tcGx1Z2lucy1wbGF5Z3JvdW5kXCIsIEpTT04uc3RyaW5naWZ5KG5ld1BsdWdpbnMpKVxufVxuXG5leHBvcnQgY29uc3QgYWRkQ3VzdG9tUGx1Z2luID0gKG1vZDogc3RyaW5nKSA9PiB7XG4gIGNvbnN0IG5ld1BsdWdpbnMgPSBjdXN0b21QbHVnaW5zKClcbiAgbmV3UGx1Z2lucy5wdXNoKG1vZClcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJjdXN0b20tcGx1Z2lucy1wbGF5Z3JvdW5kXCIsIEpTT04uc3RyaW5naWZ5KG5ld1BsdWdpbnMpKVxuICAvLyBAdHMtaWdub3JlXG4gIHdpbmRvdy5hcHBJbnNpZ2h0cyAmJlxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICB3aW5kb3cuYXBwSW5zaWdodHMudHJhY2tFdmVudCh7IG5hbWU6IFwiQWRkZWQgQ3VzdG9tIE1vZHVsZVwiLCBwcm9wZXJ0aWVzOiB7IGlkOiBtb2QgfSB9KVxufVxuXG5jb25zdCBjdXN0b21QbHVnaW5zID0gKCk6IHN0cmluZ1tdID0+IHtcbiAgcmV0dXJuIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJjdXN0b20tcGx1Z2lucy1wbGF5Z3JvdW5kXCIpIHx8IFwiW11cIilcbn1cblxuZXhwb3J0IGNvbnN0IG9wdGlvbnNQbHVnaW46IFBsdWdpbkZhY3RvcnkgPSAoaSwgdXRpbHMpID0+IHtcbiAgY29uc3QgcGx1Z2luOiBQbGF5Z3JvdW5kUGx1Z2luID0ge1xuICAgIGlkOiBcInBsdWdpbnNcIixcbiAgICBkaXNwbGF5TmFtZTogaShcInBsYXlfc2lkZWJhcl9wbHVnaW5zXCIpLFxuICAgIC8vIHNob3VsZEJlU2VsZWN0ZWQ6ICgpID0+IHRydWUsIC8vIHVuY29tbWVudCB0byBtYWtlIHRoaXMgdGhlIGZpcnN0IHRhYiBvbiByZWxvYWRzXG4gICAgd2lsbE1vdW50OiAoX3NhbmRib3gsIGNvbnRhaW5lcikgPT4ge1xuICAgICAgY29uc3QgZHMgPSB1dGlscy5jcmVhdGVEZXNpZ25TeXN0ZW0oY29udGFpbmVyKVxuXG4gICAgICBjb25zdCByZXN0YXJ0UmVxID0gZHMucChpKFwicGxheV9zaWRlYmFyX29wdGlvbnNfcmVzdGFydF9yZXF1aXJlZFwiKSlcbiAgICAgIHJlc3RhcnRSZXEuaWQgPSBcInJlc3RhcnQtcmVxdWlyZWRcIlxuXG4gICAgICBkcy5zdWJ0aXRsZShpKFwicGxheV9zaWRlYmFyX3BsdWdpbnNfb3B0aW9uc19leHRlcm5hbFwiKSlcblxuICAgICAgY29uc3QgcGx1Z2luc09MID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9sXCIpXG4gICAgICBwbHVnaW5zT0wuY2xhc3NOYW1lID0gXCJwbGF5Z3JvdW5kLXBsdWdpbnNcIlxuICAgICAgcGx1Z2luUmVnaXN0cnkuZm9yRWFjaChwbHVnaW4gPT4ge1xuICAgICAgICBjb25zdCBzZXR0aW5nQnV0dG9uID0gY3JlYXRlUGx1Z2luKHBsdWdpbilcbiAgICAgICAgcGx1Z2luc09MLmFwcGVuZENoaWxkKHNldHRpbmdCdXR0b24pXG4gICAgICB9KVxuICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHBsdWdpbnNPTClcblxuICAgICAgY29uc3Qgd2FybmluZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpXG4gICAgICB3YXJuaW5nLmNsYXNzTmFtZSA9IFwid2FybmluZ1wiXG4gICAgICB3YXJuaW5nLnRleHRDb250ZW50ID0gaShcInBsYXlfc2lkZWJhcl9wbHVnaW5zX29wdGlvbnNfZXh0ZXJuYWxfd2FybmluZ1wiKVxuICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHdhcm5pbmcpXG5cbiAgICAgIGRzLnN1YnRpdGxlKGkoXCJwbGF5X3NpZGViYXJfcGx1Z2luc19vcHRpb25zX21vZHVsZXNcIikpXG5cbiAgICAgIGNvbnN0IGN1c3RvbU1vZHVsZXNPTCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvbFwiKVxuICAgICAgY3VzdG9tTW9kdWxlc09MLmNsYXNzTmFtZSA9IFwiY3VzdG9tLW1vZHVsZXNcIlxuXG4gICAgICBjb25zdCB1cGRhdGVDdXN0b21Nb2R1bGVzID0gKCkgPT4ge1xuICAgICAgICB3aGlsZSAoY3VzdG9tTW9kdWxlc09MLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICBjdXN0b21Nb2R1bGVzT0wucmVtb3ZlQ2hpbGQoY3VzdG9tTW9kdWxlc09MLmZpcnN0Q2hpbGQpXG4gICAgICAgIH1cbiAgICAgICAgY3VzdG9tUGx1Z2lucygpLmZvckVhY2gobW9kdWxlID0+IHtcbiAgICAgICAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKVxuICAgICAgICAgIGxpLmlubmVySFRNTCA9IG1vZHVsZVxuICAgICAgICAgIGNvbnN0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKVxuICAgICAgICAgIGEuaHJlZiA9IFwiI1wiXG4gICAgICAgICAgYS50ZXh0Q29udGVudCA9IFwiWFwiXG4gICAgICAgICAgYS5vbmNsaWNrID0gKCkgPT4ge1xuICAgICAgICAgICAgcmVtb3ZlQ3VzdG9tUGx1Z2lucyhtb2R1bGUpXG4gICAgICAgICAgICB1cGRhdGVDdXN0b21Nb2R1bGVzKClcbiAgICAgICAgICAgIGFubm91bmNlV2VOZWVkQVJlc3RhcnQoKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICAgIGxpLmFwcGVuZENoaWxkKGEpXG5cbiAgICAgICAgICBjdXN0b21Nb2R1bGVzT0wuYXBwZW5kQ2hpbGQobGkpXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICB1cGRhdGVDdXN0b21Nb2R1bGVzKClcblxuICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGN1c3RvbU1vZHVsZXNPTClcbiAgICAgIGNvbnN0IGlucHV0Rm9ybSA9IGNyZWF0ZU5ld01vZHVsZUlucHV0Rm9ybSh1cGRhdGVDdXN0b21Nb2R1bGVzLCBpKVxuICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGlucHV0Rm9ybSlcblxuICAgICAgZHMuc3VidGl0bGUoaShcInBsYXlfc2lkZWJhcl9wbHVnaW5zX3BsdWdpbl9kZXZcIikpXG5cbiAgICAgIGNvbnN0IHBsdWdpbnNEZXZPTCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvbFwiKVxuICAgICAgcGx1Z2luc0Rldk9MLmNsYXNzTmFtZSA9IFwicGxheWdyb3VuZC1vcHRpb25zXCJcblxuICAgICAgY29uc3QgY29ubmVjdFRvRGV2ID0gZHMubG9jYWxTdG9yYWdlT3B0aW9uKHtcbiAgICAgICAgZGlzcGxheTogaShcInBsYXlfc2lkZWJhcl9wbHVnaW5zX3BsdWdpbl9kZXZfb3B0aW9uXCIpLFxuICAgICAgICBibHVyYjogaShcInBsYXlfc2lkZWJhcl9wbHVnaW5zX3BsdWdpbl9kZXZfY29weVwiKSxcbiAgICAgICAgZmxhZzogXCJjb25uZWN0LWRldi1wbHVnaW5cIixcbiAgICAgIH0pXG4gICAgICBwbHVnaW5zRGV2T0wuYXBwZW5kQ2hpbGQoY29ubmVjdFRvRGV2KVxuICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHBsdWdpbnNEZXZPTClcblxuICAgICAgLy8gY3JlYXRlU2VjdGlvbihpKFwicGxheV9zaWRlYmFyX29wdGlvbnNcIiksIGNhdGVnb3J5RGl2KVxuXG4gICAgICAvLyBzZXR0aW5ncy5mb3JFYWNoKHNldHRpbmcgPT4ge1xuICAgICAgLy8gICBjb25zdCBzZXR0aW5nQnV0dG9uID0gY3JlYXRlQnV0dG9uKHNldHRpbmcpXG4gICAgICAvLyAgIG9sLmFwcGVuZENoaWxkKHNldHRpbmdCdXR0b24pXG4gICAgICAvLyB9KVxuXG4gICAgICAvLyBjYXRlZ29yeURpdi5hcHBlbmRDaGlsZChvbClcbiAgICB9LFxuICB9XG5cbiAgcmV0dXJuIHBsdWdpblxufVxuXG5jb25zdCBhbm5vdW5jZVdlTmVlZEFSZXN0YXJ0ID0gKCkgPT4ge1xuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlc3RhcnQtcmVxdWlyZWRcIikhLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCJcbn1cblxuY29uc3QgY3JlYXRlU2VjdGlvbiA9ICh0aXRsZTogc3RyaW5nLCBjb250YWluZXI6IEVsZW1lbnQpID0+IHtcbiAgY29uc3QgcGx1Z2luRGV2VGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDRcIilcbiAgcGx1Z2luRGV2VGl0bGUudGV4dENvbnRlbnQgPSB0aXRsZVxuICBjb250YWluZXIuYXBwZW5kQ2hpbGQocGx1Z2luRGV2VGl0bGUpXG59XG5cbmNvbnN0IGNyZWF0ZVBsdWdpbiA9IChwbHVnaW46IHR5cGVvZiBwbHVnaW5SZWdpc3RyeVswXSkgPT4ge1xuICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKVxuICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpXG5cbiAgY29uc3QgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIilcblxuICBjb25zdCB0b3AgPSBgPHNwYW4+JHtwbHVnaW4uZGlzcGxheX08L3NwYW4+IGJ5IDxhIGhyZWY9JyR7cGx1Z2luLmF1dGhvci5ocmVmfSc+JHtwbHVnaW4uYXV0aG9yLm5hbWV9PC9hPjxici8+JHtwbHVnaW4uYmx1cmJ9YFxuICBjb25zdCBib3R0b20gPSBgPGEgaHJlZj0naHR0cHM6Ly93d3cubnBtanMuY29tL3BhY2thZ2UvJHtwbHVnaW4ubW9kdWxlfSc+bnBtPC9hPiB8IDxhIGhyZWY9XCIke3BsdWdpbi5yZXBvfVwiPnJlcG88L2E+YFxuICBsYWJlbC5pbm5lckhUTUwgPSBgJHt0b3B9PGJyLz4ke2JvdHRvbX1gXG5cbiAgY29uc3Qga2V5ID0gXCJwbHVnaW4tXCIgKyBwbHVnaW4ubW9kdWxlXG4gIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpXG4gIGlucHV0LnR5cGUgPSBcImNoZWNrYm94XCJcbiAgaW5wdXQuaWQgPSBrZXlcbiAgaW5wdXQuY2hlY2tlZCA9ICEhbG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KVxuXG4gIGlucHV0Lm9uY2hhbmdlID0gKCkgPT4ge1xuICAgIGFubm91bmNlV2VOZWVkQVJlc3RhcnQoKVxuICAgIGlmIChpbnB1dC5jaGVja2VkKSB7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICB3aW5kb3cuYXBwSW5zaWdodHMgJiZcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICB3aW5kb3cuYXBwSW5zaWdodHMudHJhY2tFdmVudCh7IG5hbWU6IFwiQWRkZWQgUmVnaXN0cnkgUGx1Z2luXCIsIHByb3BlcnRpZXM6IHsgaWQ6IGtleSB9IH0pXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIFwidHJ1ZVwiKVxuICAgIH0gZWxzZSB7XG4gICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShrZXkpXG4gICAgfVxuICB9XG5cbiAgbGFiZWwuaHRtbEZvciA9IGlucHV0LmlkXG5cbiAgZGl2LmFwcGVuZENoaWxkKGlucHV0KVxuICBkaXYuYXBwZW5kQ2hpbGQobGFiZWwpXG4gIGxpLmFwcGVuZENoaWxkKGRpdilcbiAgcmV0dXJuIGxpXG59XG5cbmNvbnN0IGNyZWF0ZU5ld01vZHVsZUlucHV0Rm9ybSA9ICh1cGRhdGVPTDogRnVuY3Rpb24sIGk6IGFueSkgPT4ge1xuICBjb25zdCBmb3JtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZvcm1cIilcblxuICBjb25zdCBuZXdNb2R1bGVJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKVxuICBuZXdNb2R1bGVJbnB1dC50eXBlID0gXCJ0ZXh0XCJcbiAgbmV3TW9kdWxlSW5wdXQuaWQgPSBcImdpc3QtaW5wdXRcIlxuICBuZXdNb2R1bGVJbnB1dC5wbGFjZWhvbGRlciA9IGkoXCJwbGF5X3NpZGViYXJfcGx1Z2luc19vcHRpb25zX21vZHVsZXNfcGxhY2Vob2xkZXJcIilcbiAgZm9ybS5hcHBlbmRDaGlsZChuZXdNb2R1bGVJbnB1dClcblxuICBmb3JtLm9uc3VibWl0ID0gZSA9PiB7XG4gICAgYW5ub3VuY2VXZU5lZWRBUmVzdGFydCgpXG4gICAgYWRkQ3VzdG9tUGx1Z2luKG5ld01vZHVsZUlucHV0LnZhbHVlKVxuICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICB1cGRhdGVPTCgpXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICByZXR1cm4gZm9ybVxufVxuIl19