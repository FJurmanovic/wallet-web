import { controller, target } from "@github/catalyst";
import { html } from "@github/jtml";
import { BaseComponentElement } from "common/";

@controller
class AppLoaderElement extends BaseComponentElement {
    private finished: boolean = true;
    private _loading: number = 0;

    constructor() {
        super();
    }

    public start = () => {
        this.finished = false;
        this._loading++;
        this.update();
    };

    public stop = () => {
        if (this._loading > 0) {
            this._loading--;
        }
        console.log(this._loading);
        if (this._loading == 0) {
            this.finishInitiate();
        }
        this.update();
    };

    public get loading() {
        return this._loading > 0;
    }

    private finishInitiate = () => {
        setTimeout(() => {
            this.finished = true;
            this.update();
        }, 300);
    };

    elementConnected = (): void => {
        this.update();
    };

    public setFinished = () => {};

    render = () => {
        const renderLoader = (finished: boolean, loading: boolean) => {
            if (!finished && !loading) {
                console.log("Removing");
                return html`<div class="loader --removing"></div>`;
            } else if (loading) {
                console.log("loading");
                return html`<div class="loader --loading"></div>`;
            }
            return html``;
        };
        return html`${renderLoader(this.finished, this.loading)}`;
    };
}

export type { AppLoaderElement };
