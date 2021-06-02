import { BaseLayoutElement } from "common/layouts";
import { update } from "core/utils";

class RouterService {
    private historyStack: Array<RouteState> = [];
    private _routes: Array<RouteState> = [];
    private domEvents: any = {
        routechanged: new Event("routechanged"),
    };
    constructor(private mainRoot: ShadowRoot | HTMLElement) {}

    get routerState(): RouteState {
        const historyLen = this.historyStack?.length;
        if (historyLen < 1) {
            return null;
        }
        return this.historyStack[historyLen - 1];
    }

    get emptyState(): boolean {
        const historyLen = this.historyStack?.length;
        if (historyLen < 2) {
            return true;
        } else {
            return false;
        }
    }

    public setRoutes = (routes: Array<any>): void => {
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

    public update = (): void => {
        if (!this._routes) return;
        const path = window.location.pathname;
        const _mainRoot = this.mainRoot;
        const route = this.routerState;
        if (path == route?.path || route?.path == "/not-found") {
            let changed: boolean = false;
            if (_mainRoot?.childNodes.length > 0) {
                _mainRoot?.childNodes?.forEach?.((child: BaseLayoutElement) => {
                    if (
                        route.layout &&
                        route.layout.toUpperCase() === child.tagName &&
                        !child.compareTags(route.component.toUpperCase())
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
                        _newElement.setAttribute(
                            "data-target",
                            "app-root.rootElement"
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
                        _newElement.setAttribute(
                            "data-target",
                            "app-root.rootElement"
                        );
                        changed = true;
                        _mainRoot.replaceChild(_newElement, child);
                    }
                });
            } else {
                if (route.layout) {
                    changed = true;
                    const _newElement = document.createElement(route.layout);
                    _newElement.setAttribute(
                        "data-target",
                        "app-root.rootElement"
                    );
                    _mainRoot.appendChild(_newElement);
                    (_newElement as BaseLayoutElement).setElement(
                        route.component
                    );
                } else {
                    const _newElement = document.createElement(route.component);
                    _newElement.setAttribute(
                        "data-target",
                        "app-root.rootElement"
                    );
                    changed = true;
                    _mainRoot.appendChild(_newElement);
                }
            }
        } else {
            const newRoute = this.findByPath();
            this.historyStack.push(newRoute);
            this.update();
        }
        window.dispatchEvent(this.domEvents.routechanged);
    };

    public goTo = (path: string): void => {
        if (!Array.isArray(this.historyStack)) this.historyStack = [];
        const currentPath = window.location.pathname;
        if (path == currentPath) return;
        const _index = this._routes.findIndex((route) => route.path === path);
        if (_index >= 0) {
            const newRoute = this._routes[_index];
            this.historyStack.push(newRoute);
            const url = new URL(window.location.toString());
            url.pathname = path;
            window.history.pushState({}, "", url.toString());
            this.update();
        }
    };

    public goBack = (): void => {
        if (!Array.isArray(this.historyStack)) this.historyStack = [];
        const lenHistory = this.historyStack.length;
        if (lenHistory > 1) {
            const nextRoute = this.historyStack[lenHistory - 2];
            const url = new URL(window.location.toString());
            url.pathname = nextRoute.path;
            window.history.pushState({}, "", url.toString());
            this.historyStack.pop();
        }
        this.update();
    };

    public init = (): void => {
        window.addEventListener("popstate", () => {
            this.historyStack.pop();
            this.update();
        });
        this.update();
    };

    public findByPath = (): RouteState => {
        const path = window.location.pathname;
        const _index = this._routes.findIndex((route) => route.path === path);
        const _indexOfEmpty = this._routes.findIndex(
            (route) => route.path === "/not-found"
        );
        if (_index === -1 && _indexOfEmpty !== -1) {
            return this._routes[_indexOfEmpty];
        } else if (_index === -1 && _indexOfEmpty === -1) {
            return new RouteState("/not-found", "not-found");
        }
        return this._routes[_index];
    };

    public comparePath = (path: string): boolean => {
        if (this.routerState?.path === path) {
            return true;
        }
        return false;
    };
}

class RouteState {
    constructor(
        public path: string,
        public component: string,
        public data?: any,
        public layout?: string,
        public middleware?: any
    ) {}
}

export default RouterService;
