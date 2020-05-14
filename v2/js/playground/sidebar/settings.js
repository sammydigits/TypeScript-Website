var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.settingsPlugin = void 0;
    exports.settingsPlugin = (i, utils) => {
        const settings = [
            {
                display: i("play_sidebar_options_disable_ata"),
                blurb: i("play_sidebar_options_disable_ata_copy"),
                flag: "disable-ata",
            },
            {
                display: i("play_sidebar_options_disable_save"),
                blurb: i("play_sidebar_options_disable_save_copy"),
                flag: "disable-save-on-type",
            },
        ];
        const plugin = {
            id: "settings",
            displayName: i("play_subnav_settings"),
            didMount: (sandbox, container) => __awaiter(void 0, void 0, void 0, function* () {
                const ds = utils.createDesignSystem(container);
                ds.subtitle(i("play_subnav_settings"));
                const ol = document.createElement("ol");
                ol.className = "playground-options";
                settings.forEach(setting => {
                    const settingButton = ds.localStorageOption(setting);
                    ol.appendChild(settingButton);
                });
                container.appendChild(ol);
            }),
        };
        return plugin;
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dGluZ3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wbGF5Z3JvdW5kL3NyYy9zaWRlYmFyL3NldHRpbmdzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7SUFFYSxRQUFBLGNBQWMsR0FBa0IsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUU7UUFDeEQsTUFBTSxRQUFRLEdBQUc7WUFDZjtnQkFDRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLGtDQUFrQyxDQUFDO2dCQUM5QyxLQUFLLEVBQUUsQ0FBQyxDQUFDLHVDQUF1QyxDQUFDO2dCQUNqRCxJQUFJLEVBQUUsYUFBYTthQUNwQjtZQUNEO2dCQUNFLE9BQU8sRUFBRSxDQUFDLENBQUMsbUNBQW1DLENBQUM7Z0JBQy9DLEtBQUssRUFBRSxDQUFDLENBQUMsd0NBQXdDLENBQUM7Z0JBQ2xELElBQUksRUFBRSxzQkFBc0I7YUFDN0I7U0FNRixDQUFBO1FBRUQsTUFBTSxNQUFNLEdBQXFCO1lBQy9CLEVBQUUsRUFBRSxVQUFVO1lBQ2QsV0FBVyxFQUFFLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQztZQUN0QyxRQUFRLEVBQUUsQ0FBTyxPQUFPLEVBQUUsU0FBUyxFQUFFLEVBQUU7Z0JBQ3JDLE1BQU0sRUFBRSxHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsQ0FBQTtnQkFFOUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFBO2dCQUV0QyxNQUFNLEVBQUUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFBO2dCQUN2QyxFQUFFLENBQUMsU0FBUyxHQUFHLG9CQUFvQixDQUFBO2dCQUVuQyxRQUFRLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO29CQUN6QixNQUFNLGFBQWEsR0FBRyxFQUFFLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLENBQUE7b0JBQ3BELEVBQUUsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUE7Z0JBQy9CLENBQUMsQ0FBQyxDQUFBO2dCQUVGLFNBQVMsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUE7WUFDM0IsQ0FBQyxDQUFBO1NBQ0YsQ0FBQTtRQUVELE9BQU8sTUFBTSxDQUFBO0lBQ2YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGxheWdyb3VuZFBsdWdpbiwgUGx1Z2luRmFjdG9yeSB9IGZyb20gXCIuLlwiXG5cbmV4cG9ydCBjb25zdCBzZXR0aW5nc1BsdWdpbjogUGx1Z2luRmFjdG9yeSA9IChpLCB1dGlscykgPT4ge1xuICBjb25zdCBzZXR0aW5ncyA9IFtcbiAgICB7XG4gICAgICBkaXNwbGF5OiBpKFwicGxheV9zaWRlYmFyX29wdGlvbnNfZGlzYWJsZV9hdGFcIiksXG4gICAgICBibHVyYjogaShcInBsYXlfc2lkZWJhcl9vcHRpb25zX2Rpc2FibGVfYXRhX2NvcHlcIiksXG4gICAgICBmbGFnOiBcImRpc2FibGUtYXRhXCIsXG4gICAgfSxcbiAgICB7XG4gICAgICBkaXNwbGF5OiBpKFwicGxheV9zaWRlYmFyX29wdGlvbnNfZGlzYWJsZV9zYXZlXCIpLFxuICAgICAgYmx1cmI6IGkoXCJwbGF5X3NpZGViYXJfb3B0aW9uc19kaXNhYmxlX3NhdmVfY29weVwiKSxcbiAgICAgIGZsYWc6IFwiZGlzYWJsZS1zYXZlLW9uLXR5cGVcIixcbiAgICB9LFxuICAgIC8vIHtcbiAgICAvLyAgIGRpc3BsYXk6ICdWZXJib3NlIExvZ2dpbmcnLFxuICAgIC8vICAgYmx1cmI6ICdUdXJuIG9uIHN1cGVyZmx1b3VzIGxvZ2dpbmcnLFxuICAgIC8vICAgZmxhZzogJ2VuYWJsZS1zdXBlcmZsdW91cy1sb2dnaW5nJyxcbiAgICAvLyB9LFxuICBdXG5cbiAgY29uc3QgcGx1Z2luOiBQbGF5Z3JvdW5kUGx1Z2luID0ge1xuICAgIGlkOiBcInNldHRpbmdzXCIsXG4gICAgZGlzcGxheU5hbWU6IGkoXCJwbGF5X3N1Ym5hdl9zZXR0aW5nc1wiKSxcbiAgICBkaWRNb3VudDogYXN5bmMgKHNhbmRib3gsIGNvbnRhaW5lcikgPT4ge1xuICAgICAgY29uc3QgZHMgPSB1dGlscy5jcmVhdGVEZXNpZ25TeXN0ZW0oY29udGFpbmVyKVxuXG4gICAgICBkcy5zdWJ0aXRsZShpKFwicGxheV9zdWJuYXZfc2V0dGluZ3NcIikpXG5cbiAgICAgIGNvbnN0IG9sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9sXCIpXG4gICAgICBvbC5jbGFzc05hbWUgPSBcInBsYXlncm91bmQtb3B0aW9uc1wiXG5cbiAgICAgIHNldHRpbmdzLmZvckVhY2goc2V0dGluZyA9PiB7XG4gICAgICAgIGNvbnN0IHNldHRpbmdCdXR0b24gPSBkcy5sb2NhbFN0b3JhZ2VPcHRpb24oc2V0dGluZylcbiAgICAgICAgb2wuYXBwZW5kQ2hpbGQoc2V0dGluZ0J1dHRvbilcbiAgICAgIH0pXG5cbiAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChvbClcbiAgICB9LFxuICB9XG5cbiAgcmV0dXJuIHBsdWdpblxufVxuIl19