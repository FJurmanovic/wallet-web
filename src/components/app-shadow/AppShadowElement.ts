import { controller } from "@github/catalyst";
import style from "styles/main.scss";

@controller
class AppShadowElement extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.attachShadow({ mode: "open" });
        const _appMain = document.createElement("app-main");
        const _style = document.createElement("style");
        _style.innerHTML = style;

        this.shadowRoot.appendChild(_style);
        this.shadowRoot.appendChild(_appMain);
    }
}
