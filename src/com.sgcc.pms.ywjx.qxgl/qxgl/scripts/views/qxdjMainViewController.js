$ns("qxgl.views");

$import("qxgl.views.qxdjMainView");

qxgl.views.qxdjMainViewController = function() {
	var me = $extend(mx.views.ViewController);
    var base = {};

    me.getView = function() {
        console.log("qxdj main view controller getView called!");
        if (me.view == null) {
			me.view = new qxgl.views.qxdjMainView({
				controller : me
			});
        }
        
        return me.view;
    };

    me.endOfClass(arguments);
	return me;
};