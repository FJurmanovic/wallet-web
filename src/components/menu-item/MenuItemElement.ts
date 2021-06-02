import { attr, controller, target } from "@github/catalyst";
import { html, TemplateResult } from "@github/jtml";
import { AppMainElement } from "components/app-main/AppMainElement";
import { RouterService } from "core/services";
import { BaseComponentElement } from "common/";

@controller
class MenuItemElement extends BaseComponentElement {
    @attr path: string;
    @attr title: string;
    @target itemEl: HTMLElement;
    routerService: RouterService;
    constructor() {
        super();
    }

    public elementConnected = (): void => {
        this.routerService = this.appMain?.routerService;
        if (!this.title && this.innerText) {
            const _slottedText = this.innerText;
            this.innerText = null;
            this.title = _slottedText;
        }
        this.update();
        this.appMain.addEventListener("routechanged", this.update);
    };

    public elementDisconnected = (appMain: AppMainElement): void => {
        appMain?.removeEventListener("routechanged", this.update);
    };

    get current(): boolean {
        return this.routerService.comparePath(this.path);
    }

    render = (): TemplateResult => {
        return html`
            <div
                class="${this.current ? "selected " : ""}menu-item"
                data-target="menu-item.itemEl"
            >
                <app-link data-to="${this.path}">${this.title}</app-link>
            </div>
        `;
    };
}

export type { MenuItemElement };
