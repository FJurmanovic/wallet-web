import { BaseLayoutElement } from "common/layouts";
import { update } from "core/utils";

class RouterService {
    private historyStack: Array<RouteState> = [];
    private _routes: Array<RouteState> = [];
    constructor(private mainRoot: Element) {}

    get routerState() {
        const historyLen = this.historyStack?.length;
        if (historyLen < 1) {
            return null;
        }
        return this.historyStack[historyLen - 1];
    }

    setRoutes = (routes: Array<any>) => {
        if (!Array.isArray(this._routes)) this._routes = [];
        routes.forEach((route) => {
            const { path, component, data, layout, middleware } = route;
            const _routeState: RouteState = new RouteState(
                path,
                component,
                data,
                layout,
                middleware
            );
            this._routes?.push(_routeState);
        });
    };

    update() {
        if (!this._routes) return;
        const path = window.location.pathname;
        const _mainRoot = this.mainRoot;
        for (const route of this._routes) {
            if (path == route.path) {
                if (route.middleware && typeof route.middleware == "function") {
                    if (route.middleware()) return;
                }
                let changed: boolean = false;
                if (_mainRoot?.childNodes.length > 0) {
                    console.log(_mainRoot.childNodes);
                    _mainRoot?.childNodes?.forEach?.(
                        (child: BaseLayoutElement) => {
                            console.log("Eh");
                            if (
                                route.layout &&
                                route.layout.toUpperCase() === child.tagName &&
                                !child.compareTags(
                                    route.component.toUpperCase()
                                )
                            ) {
                                changed = true;
                                child.setElement(route.component);
                            } else if (
                                route.layout &&
                                route.layout.toUpperCase() !== child.tagName
                            ) {
                                changed = true;
                                const _newElement = document.createElement(
                                    route.layout
                                );
                                _mainRoot.replaceChild(_newElement, child);
                                (_newElement as BaseLayoutElement).setElement(
                                    route.component
                                );
                            } else if (
                                !route.layout &&
                                child.tagName !== route.component
                            ) {
                                const _newElement = document.createElement(
                                    route.component
                                );
                                changed = true;
                                _mainRoot.replaceChild(_newElement, child);
                            }
                        }
                    );
                } else {
                    if (route.layout) {
                        changed = true;
                        const _newElement = document.createElement(
                            route.layout
                        );
                        _mainRoot.appendChild(_newElement);
                        (_newElement as BaseLayoutElement).setElement(
                            route.component
                        );
                    } else {
                        const _newElement = document.createElement(
                            route.component
                        );
                        changed = true;
                        _mainRoot.appendChild(_newElement);
                    }
                }
                return;
            }
        }
        _mainRoot.innerHTML = "404 - Not found";
    }

    @update
    goTo(path: string) {
        if (!Array.isArray(this.historyStack)) this.historyStack = [];
        const _index = this._routes.findIndex((route) => route.path === path);
        if (_index >= 0) {
            const newRoute = this._routes[_index];
            this.historyStack.push(newRoute);
            const url = new URL(window.location.toString());
            url.pathname = path;
            window.history.pushState({}, "", url.toString());
        }
    }

    @update
    goBack() {
        if (!Array.isArray(this.historyStack)) this.historyStack = [];
        const lenHistory = this.historyStack.length;
        if (lenHistory > 1) {
            const nextRoute = this.historyStack[lenHistory - 2];
            const url = new URL(window.location.toString());
            url.pathname = nextRoute.path;
            window.history.pushState({}, "", url.toString());
            this.historyStack.pop();
        }
    }

    @update
    init() {}
}

class RouteState {
    constructor(
        public path: string,
        public component: string,
        public data: any,
        public layout: string,
        public middleware: any
    ) {}
}

export default RouterService;
