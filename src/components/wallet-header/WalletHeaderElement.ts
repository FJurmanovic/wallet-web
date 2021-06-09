import { attr, controller, target } from "@github/catalyst";
import { html, TemplateResult } from "@github/jtml";
import { BaseComponentElement } from "common/";
import { CircleLoaderElement } from "components/circle-loader/CircleLoaderElement";
import { findMethod } from "core/utils";

@controller
class WalletHeaderElement extends BaseComponentElement {
    @attr currentBalance: number;
    @attr lastMonth: number;
    @attr nextMonth: number;
    @attr currency: string;
    @attr custom: string;

    fetchFunc: Function = () => {};
    constructor() {
        super();
    }

    elementConnected = (): void => {
        this.executeFetch();
        this.update();
    };

    attributeChangedCallback(): void {
        this.update();
    }

    executeFetch = async (options?): Promise<void> => {
        const actionString = this.custom;
        const submitFunc = findMethod(actionString, this.appMain);

        try {
            this.loader?.start?.();
            await submitFunc(options);
            this.loader?.stop?.();
        } catch (err) {
            this.loader?.stop?.();
            console.error(err);
        }
    };

    render = (): TemplateResult => {
        const { currentBalance, currency, lastMonth, nextMonth } = this;

        const renderItem = (header, balance, currency) => html`<div>
            <div>${header}</div>
            <div><span>${balance}</span><span>${currency}</span></div>
        </div>`;

        const renderHeader = () => {
            if (this.loader && this.loader.loading) {
                return html`<circle-loader></circle-loader>`;
            }
            return html`${renderItem(
                "Last Month",
                lastMonth,
                currency
            )}${renderItem(
                "Current Balance",
                currentBalance,
                currency
            )}${renderItem("Next Month", nextMonth, currency)}`;
        };

        return html`<div>${renderHeader()}</div>`;
    };
}

export type { WalletHeaderElement };
