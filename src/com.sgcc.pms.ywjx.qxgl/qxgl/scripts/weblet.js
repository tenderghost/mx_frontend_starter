$import("qxgl.views.qxdjMainViewController");

mx.weblets.WebletManager.register({
    id: "qxgl",
    name: "qxgl",
    requires: [],
    onload: function(e) {

    },
    onstart: function(e) {
        var mvc = new qxgl.views.qxdjMainViewController();
        e.context.rootViewPort.setViewController(mvc);
    }
});