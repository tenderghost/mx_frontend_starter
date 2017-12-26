/// <reference path="../mx.d.ts" />

export class QxglMainViewController {
    private me: any = $extend(mx.views.ViewController)

    constructor() {
        console.log("QxglMainViewController started!");
    }

    getView() {
        console.log("getView function called");
        this.me.getView();
    }
}
