import { BaseLayoutElement } from "common/layouts";
import { AppMainElement } from "components/";

class RouterService {
    private historyStack: Array<RouteState> = [];
    private _routes: Array<RouteState> = [];
    constructor(
        private appMain: AppMainElement,
        private mainRoot: ShadowRoot | HTMLElement
    ) {}

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
            const { path, component, data, layout, middleware, children } =
                route;
            const _pathArr = path?.split?.("/").filter((a) => a);
            let newPath = ["", ..._pathArr].join("/");
            if (newPath == "") newPath = "/";
            const _routeState: RouteState = new RouteState(
                newPath,
                component,
                data,
                layout,
                middleware
            );
            if (Array.isArray(children) && children?.length > 0) {
                children.forEach((child) => {
                    const _childState: RouteState = this.createChildState(
                        child,
                        route
                    );
                    this._routes?.push(_childState);
                });
            }
            this._routes?.push(_routeState);
        });
    };

    public update = (): void => {
        if (!this._routes) return;
        const path = window.location.pathname;
        const [hasDynamic, _dynamicIndex] = this.hasDynamicPath(path);
        const _mainRoot = this.mainRoot;
        let route: RouteState = this.routerState;
        if (route?.middleware) {
            if (
                !(
                    typeof route?.middleware == "function" && route.middleware()
                ) ||
                route.middleware === false
            ) {
                return this.goTo("/unauthorized");
            }
        }
        if (
            path == route?.path ||
            route?.path == "/not-found" ||
            (hasDynamic && this?._routes?.[_dynamicIndex]?.path == route?.path)
        ) {
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
            const [isDynamic, _dynamicIndex, dynamicProps] =
                this.hasDynamicPath(path);
            let newRoute: RouteState;
            if (isDynamic && _dynamicIndex !== -1) {
                newRoute = this._routes[_dynamicIndex];
                newRoute.data = dynamicProps;
            } else {
                newRoute = this.findByPath();
            }
            this.historyStack.push(newRoute);
            this.update();
        }
        this.appMain.dispatchEvent(this.appMain?.domEvents.routechanged);
    };

    public goTo = (path: string, data?: any): void => {
        if (!Array.isArray(this.historyStack)) this.historyStack = [];
        const currentPath = window.location.pathname;
        if (path == currentPath) return;
        if (path.includes(":") && data) {
            path = resolvePath(path, data);
        }
        const _index = this._routes.findIndex((route) => route.path === path);
        const _indexOfEmpty = this._routes.findIndex(
            (route) => route.path === "/not-found"
        );
        const [isDynamic, _dynamicIndex, dynamicProps] =
            this.hasDynamicPath(path);
        if (isDynamic) {
            const [isCurrentDynamic, currIndex] =
                this.hasDynamicPath(currentPath);
            if (path == currentPath) return;
        }
        let newRoute: RouteState;
        if (isDynamic && _dynamicIndex !== -1) {
            newRoute = this._routes[_dynamicIndex];
            newRoute.data = dynamicProps;
        } else if (_index === -1 && _indexOfEmpty !== -1) {
            newRoute = this._routes[_indexOfEmpty];
        } else if (_index === -1 && _indexOfEmpty === -1) {
            newRoute = new RouteState("/not-found", "not-found");
        } else {
            newRoute = this._routes[_index];
        }

        this.historyStack.push(newRoute);
        const url = new URL(window.location.toString());
        url.pathname = path;
        window.history.pushState({}, "", url.toString());
        this.update();
    };

    public goBack = (): void => {
        if (!Array.isArray(this.historyStack)) this.historyStack = [];
        const lenHistory = this.historyStack.length;
        if (this.canGoBack) {
            const nextRoute = this.historyStack[lenHistory - 2];
            const url = new URL(window.location.toString());
            url.pathname = nextRoute.path;
            window.history.pushState({}, "", url.toString());
            this.historyStack.pop();
        }
        this.update();
    };

    public get canGoBack(): boolean {
        const lenHistory = this.historyStack.length;
        if (lenHistory > 2) {
            return true;
        }
        return false;
    }

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
        if (this.routerState?.fullPath === path) {
            return true;
        }
        return false;
    };

    private createChildState = (child: any, parent: any): RouteState => {
        const { path, middleware, layout, component, data, children } = child;
        const _pathArr = path?.split?.("/").filter((a) => a);
        const _parentArr = parent?.path?.split?.("/").filter((a) => a);
        const newPath = ["", ..._parentArr, ..._pathArr].join("/");
        const _child = new RouteState(
            newPath,
            component,
            data,
            layout,
            middleware ? middleware : parent?.middleware
        );

        if (Array.isArray(children) && children?.length > 0) {
            children.forEach((child2) => {
                const _childState: RouteState = this.createChildState(
                    child2,
                    _child
                );
                this._routes?.push(_childState);
            });
        }
        return _child;
    };

    private hasDynamicPath = (path: string): [boolean, number, any] => {
        const _pathArr = path.split("/").filter((a) => a);
        let matchedIndex: number = 0;
        let matched: boolean = false;
        let dynamicProps: any = {};
        let shouldSkip = false;
        this._routes.forEach((route, _routeId) => {
            if (shouldSkip) {
                return;
            }
            if (path == route.path) {
                matched = path?.includes(":") ? true : false;
                matchedIndex = _routeId;
                shouldSkip = true;
            }
            const _routeArr = route.path.split("/").filter((a) => a);
            if (_pathArr.length === _routeArr.length) {
                let pathMatches: number = 0;
                let hasDynamic: boolean = false;
                _pathArr.forEach((pathr, i) => {
                    if (pathr == _routeArr[i]) {
                        pathMatches++;
                    } else if (_routeArr[i].startsWith?.(":")) {
                        pathMatches++;
                        hasDynamic = true;
                        dynamicProps[_routeArr[i].substr(1)] = pathr;
                    }
                });
                if (pathMatches === _pathArr.length && hasDynamic) {
                    matchedIndex = _routeId;
                    matched = true;
                    shouldSkip = true;
                }
            }
        });
        return [matched, matchedIndex, dynamicProps];
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

    get fullPath(): string {
        return resolvePath(this.path, this.data);
    }
}

type DynamicProp = {
    index: string;
    path: string;
};

function resolvePath(path: string, data: any): string {
    const _pathArr = path
        .split("/")
        .filter((a) => a)
        .map((pathPart) => {
            if (pathPart.startsWith(":")) {
                pathPart = data?.[pathPart.substr(1)];
            }
            return pathPart;
        });
    let _return = ["", ..._pathArr].join("/");
    if (_return == "") {
        _return = "/";
    }
    return _return;
}

export default RouterService;
