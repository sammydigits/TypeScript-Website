var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "../localizeWithFallback"], function (require, exports, localizeWithFallback_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.showErrors = void 0;
    exports.showErrors = (i, utils) => {
        const plugin = {
            id: "errors",
            displayName: i("play_sidebar_errors"),
            modelChangedDebounce: (sandbox, model, container) => __awaiter(void 0, void 0, void 0, function* () {
                const ds = utils.createDesignSystem(container);
                sandbox.getWorkerProcess().then(worker => {
                    worker.getSemanticDiagnostics(model.uri.toString()).then(diags => {
                        // Bail early if there's nothing to show
                        if (!diags.length) {
                            ds.showEmptyScreen(localizeWithFallback_1.localize("play_sidebar_errors_no_errors", "No errors"));
                            return;
                        }
                        // Clean any potential empty screens
                        ds.clear();
                        ds.listDiags(sandbox, model, diags);
                    });
                });
            }),
        };
        return plugin;
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hvd0Vycm9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BsYXlncm91bmQvc3JjL3NpZGViYXIvc2hvd0Vycm9ycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBR2EsUUFBQSxVQUFVLEdBQWtCLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQ3BELE1BQU0sTUFBTSxHQUFxQjtZQUMvQixFQUFFLEVBQUUsUUFBUTtZQUNaLFdBQVcsRUFBRSxDQUFDLENBQUMscUJBQXFCLENBQUM7WUFDckMsb0JBQW9CLEVBQUUsQ0FBTyxPQUFPLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxFQUFFO2dCQUN4RCxNQUFNLEVBQUUsR0FBRyxLQUFLLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLENBQUE7Z0JBRTlDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRTtvQkFDdkMsTUFBTSxDQUFDLHNCQUFzQixDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7d0JBQy9ELHdDQUF3Qzt3QkFDeEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7NEJBQ2pCLEVBQUUsQ0FBQyxlQUFlLENBQUMsK0JBQVEsQ0FBQywrQkFBK0IsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFBOzRCQUMxRSxPQUFNO3lCQUNQO3dCQUVELG9DQUFvQzt3QkFDcEMsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFBO3dCQUNWLEVBQUUsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQTtvQkFDckMsQ0FBQyxDQUFDLENBQUE7Z0JBQ0osQ0FBQyxDQUFDLENBQUE7WUFDSixDQUFDLENBQUE7U0FDRixDQUFBO1FBRUQsT0FBTyxNQUFNLENBQUE7SUFDZixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQbGF5Z3JvdW5kUGx1Z2luLCBQbHVnaW5GYWN0b3J5IH0gZnJvbSBcIi4uXCJcbmltcG9ydCB7IGxvY2FsaXplIH0gZnJvbSBcIi4uL2xvY2FsaXplV2l0aEZhbGxiYWNrXCJcblxuZXhwb3J0IGNvbnN0IHNob3dFcnJvcnM6IFBsdWdpbkZhY3RvcnkgPSAoaSwgdXRpbHMpID0+IHtcbiAgY29uc3QgcGx1Z2luOiBQbGF5Z3JvdW5kUGx1Z2luID0ge1xuICAgIGlkOiBcImVycm9yc1wiLFxuICAgIGRpc3BsYXlOYW1lOiBpKFwicGxheV9zaWRlYmFyX2Vycm9yc1wiKSxcbiAgICBtb2RlbENoYW5nZWREZWJvdW5jZTogYXN5bmMgKHNhbmRib3gsIG1vZGVsLCBjb250YWluZXIpID0+IHtcbiAgICAgIGNvbnN0IGRzID0gdXRpbHMuY3JlYXRlRGVzaWduU3lzdGVtKGNvbnRhaW5lcilcblxuICAgICAgc2FuZGJveC5nZXRXb3JrZXJQcm9jZXNzKCkudGhlbih3b3JrZXIgPT4ge1xuICAgICAgICB3b3JrZXIuZ2V0U2VtYW50aWNEaWFnbm9zdGljcyhtb2RlbC51cmkudG9TdHJpbmcoKSkudGhlbihkaWFncyA9PiB7XG4gICAgICAgICAgLy8gQmFpbCBlYXJseSBpZiB0aGVyZSdzIG5vdGhpbmcgdG8gc2hvd1xuICAgICAgICAgIGlmICghZGlhZ3MubGVuZ3RoKSB7XG4gICAgICAgICAgICBkcy5zaG93RW1wdHlTY3JlZW4obG9jYWxpemUoXCJwbGF5X3NpZGViYXJfZXJyb3JzX25vX2Vycm9yc1wiLCBcIk5vIGVycm9yc1wiKSlcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIENsZWFuIGFueSBwb3RlbnRpYWwgZW1wdHkgc2NyZWVuc1xuICAgICAgICAgIGRzLmNsZWFyKClcbiAgICAgICAgICBkcy5saXN0RGlhZ3Moc2FuZGJveCwgbW9kZWwsIGRpYWdzKVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9LFxuICB9XG5cbiAgcmV0dXJuIHBsdWdpblxufVxuIl19