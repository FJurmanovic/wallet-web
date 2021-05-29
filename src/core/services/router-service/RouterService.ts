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
            const { path, component, data, layout } = route;
            const _routeState: RouteState = new RouteState(
                path,
                component,
                data,
                layout
            );
            this._routes?.push(_routeState);
        });
    };

    update() {
        if (!this._routes) return;
        for (const route of this._routes) {
            const path = window.location.pathname;
            if (path == route.path) {
                const _mainRoot = this.mainRoot;
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
    }

    @update
    goTo(path: string) {
        if (!Array.isArray(this.historyStack)) this.historyStack = [];
        const _index = this._routes.findIndex((route) => route.path === path);
        if (_index >= 0) {
            this.historyStack.push(this._routes[_index]);
            const url = new URL(window.location.toString());
            url.pathname = path;
            window.history.pushState({}, "", url.toString());
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
        public layout: string
    ) {}
}

export default RouterService;
