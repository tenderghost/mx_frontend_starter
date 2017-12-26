/// <reference path="../mx.d.ts" />

import { QxglMainViewController } from "./QxglMainViewController";

mx.weblets.WebletManager.register({
    id: "qxgl",
    name: "qxgl",
    requires: [],
    onload: function(e)
    {
    },
    onstart: function(e)
    {
        var mvc = new QxglMainViewController();
        e.context.rootViewPort.setViewController(mvc);
    }
});