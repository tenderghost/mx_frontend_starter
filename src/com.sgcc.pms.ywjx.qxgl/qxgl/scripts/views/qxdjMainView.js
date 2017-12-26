/**
 * 缺陷模块：缺陷登记页面
 * Copyright (C) 2013 国家电网
 * Provider: 
 * 版权说明：2013.06.26 杨明荣
 */
$ns("qxgl.views");

$import("mx.datacontainers.GridEntityContainer");
$import("mx.datacontrols.DataGrid");
// TabControl控件
$import("mx.containers.TabControl");
// VSplit控件
$import("mx.containers.VSplit");
// HSplit控件
$import("mx.containers.HSplit");
$import("mx.windows.MessageBox");

qxgl.views.qxdjMainView = function() {
	var me = $extend(mx.views.View);
	var base = {};


	// 网格列表
	var _dataGrid = null;

	base.init = me.init;
	me.init = function() {
		base.init();
		_initControls();
	};

	function _initControls() {
		// 提供一个面板在水平方向上的 Split控件
		me.mainVSplit = new mx.containers.VSplit({
			cols : "20%, auto",
			resizable : true,
     		activePanelIndex : 0
		});
		// 添加水平方向的split控件
		me.addControl(me.mainVSplit);
		// 初始化工具栏
		_initToolBar();
		// 初始化表格
		_initDataGrid();
		// 创建左侧导航树
		//_initTree();
		// 创建公共弹窗
		_initDetailWindow();
		// 创建消息弹窗框
		_initMessageBox();
		me.on("activate", me.controller._onactivate);
	}

	/**
	 * 初始化tree
	 */
	function _initTree() {
 		var pmsutil = new mxpms.utils.UserInfoUtil();
		var userMessage = pmsutil.getLoginUser();
		var gljb = userMessage.GLJB;
		var isc_id = null;
		if(gljb != null){
			// 省（自治区、直辖市）电力公司
			if(gljb == "3"){
				// 所属网省ID
				isc_id = userMessage.SSWSID;
			}
			else if(gljb == "4"){
				// 所属地市ID
				isc_id = userMessage.SSDSID;
			}
			else if(gljb == "6" || gljb == "5"){
				// 所属单位ID
				isc_id = userMessage.SSDWID;
			}
			else if(gljb.startsWith("80")){
				// 当前部门ID
				isc_id = userMessage.DEPTID;
			}
		}
		var baseUrl = null;
		if($isEmpty(isc_id)){
			baseUrl = mxpms.mappath("~/rest/pmstreeservice/tree/"+ YW_QX_DZXLTREEID + "__isc_id@"+userMessage.SSDWID);
		}
		else{
			baseUrl = mxpms.mappath("~/rest/pmstreeservice/tree/"+ YW_QX_DZXLTREEID + "__isc_id@"+isc_id);
		}
		me.treeView = new mx.datacontrols.DataTree(
				{
					// dzxlTreeId是qxglResources/scripts/views/qxdjConstants.js中的常量
					baseUrl : baseUrl,
					displayCheckBox : false, // 是否需要在树中显示选中框
					showDefaultContextMenu : false, // 是否启用右键菜单
					onselectionchanged : me.controller._tree_selectionchanged
				});
		me.treeView.load();

		// 添加导航树到水平方向split控件左侧
		me.mainVSplit.addControl(me.treeView, 0);
	}

	/**
	 * 初始化工具栏
	 */
	function _initToolBar() {
		me.toolBar = new mx.controls.ToolBar({
			width : "100%",
			alias : "qxdjMainViewToolBar",
			items : [ {
				name : "new",
				text : "新建",
				toolTip : "新建",
				imageKey : "add",
				onclick : me.controller._btnNew_onclick
			}, "-", {
				name : "edit",
				text : "修改",
				toolTip : "修改",
				imageKey : "edit",
				onclick : me.controller._btnEdit_onclick
			}, "-", {
				name : "delete",
				text : "删除",
				toolTip : "删除",
				imageKey : "delete",
				onclick : me.controller._btnDelete_onclick
			}, "-", {
				name : "qxview",
				text : "查看",
				toolTip : "查看",
				imageKey : "pmsimage/chakan",
				onclick : me.controller._btnView_onclick
			}, "-", {
				name : "send",
				text : "启动流程",
				toolTip : "启动流程",
				imageKey : "pmsimage/kaishiLC",
				onclick : me.controller._btnSend_onclick
			}, "-", {
				name : "viewLct",
				text : "查看流程图",
				toolTip : "查看流程图",
				imageKey : "pmsimage/liuchengtu",
				onclick : me.controller._btnViewLct_onclick
			}, "-", {
				name : "export",
				text : "导出",
				toolTip : "导出",
				imageKey : "pmsimage/daochu",
				onclick : me.controller._btnExport_onclick
			}, "-", {
				name : "backOms",
				text : "运检退回",
				toolTip : "运检退回",
				imageKey : "pmsimage/tuihui",
				onclick : me.controller._btnBackOms_onclick
			}, "-", {
					name : "fstms",
					imageKey : "pmsimage/shangbao",
					text : "发送至TMS",
					toolTip : "发送至TMS",
					onclick : me.controller._btnFs_onclick	
				}
			]
		});
		me.toolBar.$(".toolBarFlag").hide();
	}

	/**
	 * 初始化表格
	 */
	function _initDataGrid() {
		var restUrl = "~/rest/tyjdwyjqxjl/";
		/* 初始化 EntityContainer */
		var gridEntityContainer = new mx.datacontainers.GridEntityContainer({
			baseUrl : qxgl.mappath(restUrl),
			iscID : "-1", // iscID 是数据元素的统一权限功能编码。默认值为 "-1" ，表示不应用权限设置。
			primaryKey : "objId"
		});

		/* 初始化 DataGrid */
		_dataGrid = new mx.datacontrols.DataGrid({
			// 构造查询属性。
			alias : "qxgl",/*
			searchBox : new mxpms.datacontrols.DataGridSearchBox({
				initHidden : false,
				fields : [
						{
							name : "qxzt",
							caption : "缺陷状态",
							editorType : "DropDownEditor",
							hint : "--请选择--",
							displayCloseButton : false
						}, {
							name : "dydj",
							caption : "电压等级",
							editorType : "DropDownEditor",
							hint : "--请选择--",
							displayCloseButton : false
						}, {
							name : "sblx",
							caption : "设备类型",
							editorType : "DropDownTreeEditor",
							hint : "--请选择--",
							url : mxpms.mappath("~/rest/pmstreeservice/tree/"
									+ YW_QX_SBLXTREEID)
						}, {
							name : "sfjzxqx",
							caption : "家族缺陷",
							editorType : "DropDownEditor",
							hint : "--请选择--",
							displayCloseButton : false
						}, {
							name : "qxxz",
							caption : "缺陷性质",
							editorType : "DropDownEditor",
							hint : "--请选择--"
						}, {
							name : "sfxq",
							caption : "已消缺",
							editorType : "DropDownEditor",
							hint : "--请选择--",
							displayCloseButton : false
						}, {
							name : "fxbzid",
							caption : "发现班组",
							editorType : "DropDownTreeEditor",
							allowDropDown : true,
							hint : "--请选择--",
							url : mxpms.mappath("~/rest/pmstreeservice/tree/"
									+ YW_QX_DWBMTREEID)
						}, {
							name : "fxlylx",
							caption : "发现方式",
							editorType : "DropDownEditor",
							hint : "--请选择--",
							displayCloseButton : false
						}, {
							name : "fxrqk",
							caption : "发现日期",
							editorType : "DateTimeEditor",
							formatString : "yyyy-MM-dd",
							hint : "--请选择--",
							customValidate : me.controller._searchBox_fxrqk_customValidate
						}, {
							name : "fxrqz",
							caption : "至",
							editorType : "DateTimeEditor",
							formatString : "yyyy-MM-dd",
							hint : "--请选择--",
							customValidate : me.controller._searchBox_fxrqz_customValidate
						}, {
							name : "sccj",
							caption : "生产厂家",
							editorType : "TextEditor",
							hint : "--请输入--",
							customValidate : qxfunc_globalfunc_textCusValidator
						}, {
							name : "qxzsbmc",
							caption : "缺陷设备",
							editorType : "TextEditor",
							hint : "--请输入--",
							customValidate : qxfunc_globalfunc_textCusValidator
						}, {
							name : "zxlx",
							caption : "站线类型",
							editorType : "DropDownEditor",
							hint : "--请选择--",
							displayCloseButton : false
						}, {
							name : "dzorxlmc",
							caption : "电站/线路",
							editorType : "TextEditor",
							hint : "--请输入--",
							customValidate : qxfunc_globalfunc_textCusValidator
						}
						, {
							name : "ssdkxmc",
							caption : "所属大馈线",
							editorType : "TextEditor",
							hint : "--请输入--",
							customValidate : qxfunc_globalfunc_textCusValidator
						}
						],
						itemNumOfRow : 4,
						onsearching : me.controller._dataGrid_searchBox_onsearching
			}),*/
			columns : [ {
				name : "objId",
				caption : "OBJ_ID",
				editorType : "TextEditor"
			}, {
				name : "qxbh",
				caption : "缺陷编号",
				editorType : "TextEditor"
			}, {
				name : "fxrq",
				caption : "发现日期",
				editorType : "DateTimeEditor",
				formatString : "yyyy-MM-dd HH:mm:ss",
				width : "130px"
			}, {
				name : "qxzt",
				caption : "缺陷状态",
				editorType : "TextEditor"
			}, {
				name : "dqclr",
				caption : "当前处理人",
				editorType : "TextEditor"
			}, {
				name : "dzorxlmc",
				caption : "电站/线路",
				editorType : "TextEditor"
			}, {
				name : "qxzsbmc",
				caption : "缺陷设备",
				editorType : "TextEditor"
			}, {
				name : "sfsdgtd",
				caption : "是否是多段杆塔",
				editorType : "TextEditor",
				visible : false
			}, {
				name : "dgtdid",
				caption : "缺陷主设备多杆塔段ID",
				editorType : "TextEditor",
				visible : false
			}, {
				name : "dgtdmc",
				caption : "缺陷主设备多杆塔段名称",
				editorType : "TextEditor",
				visible : false
			}, {
				name : "qxnr",
				caption : "缺陷内容",
				editorType : "TextEditor",
				width : "250px"
			}, {
				name : "zxlx",
				caption : "站线类型",
				editorType : "DropDownEditor"
			}, 
				{
				name : "ssdkxid",
				caption : "所属大馈线ID",
				editorType : "TextEditor",
				visible : false
			}, {
				name : "ssdkxmc",
				caption : "所属大馈线",
				editorType : "TextEditor"
			},
			{
				name : "dydj",
				caption : "电压等级",
				editorType : "DropDownEditor"
			}, {
				name : "sblx",
				caption : "设备类型",
				editorType : "DropDownEditor"
			}, {
				name : "sccj",
				caption : "生产厂家",
				editorType : "TextEditor",
				width : "150px"
			}, {
				name : "qxxz",
				caption : "缺陷性质",
				editorType : "DropDownEditor"
			}, {
				name : "qxmsmc",
				caption : "缺陷描述",
				editorType : "TextEditor"
			}, {
				name : "fxbz",
				caption : "发现班组",
				editorType : "TextEditor"
			}, {
				name : "fxr",
				caption : "发现人",
				editorType : "TextEditor"
			}, {
				name : "djr",
				caption : "填报人",
				editorType : "TextEditor"
			}, {
				name : "lcslid",
				caption : "流程实例ID",
				editorType : "TextEditor"
			}, {
				name : "djsj",
				caption : "填报时间",
				editorType : "DateTimeEditor",
				formatString : "yyyy-MM-dd HH:mm:ss",
				width : "130px"
			}, {
				name : "dcqtx",
				isVirtual : true,
				caption : "距超期时间",
				editorType : "TextEditor"
			}, {
				name : "sfyshg",
				isVirtual : true,
				caption : "是否验收合格",
				editorType : "DropDownEditor"
			}, {
				name : "omssfjs",
				caption : "是否接受",
				editorType : "TextEditor"
			}, {
				name : "sfyzyh",
				caption : "是否已转隐患",
				editorType : "TextEditor"
			}, {
				name : "sffsdd",
				caption : "是否发送调度",
				editorType : "TextEditor"
			}],
			// 构造列排序条件，如果有多列，则以逗号分隔。例sorter: "school ASC, class DESC"
			displayCheckBox : true,
			displayPrimaryKey : false,// 列表是否显示主键
			allowEditing : false, // 列表默认不可编辑
			allowSorting : true,
			rowNumberColWidth : 35,
			enableCellTip : true,
			pageSize : 20,
			pageSizeOptions : [10,20,30,40,50,60,70,80,90,100,200,500],
			autoWrap:false,//自动换行
			sorter : "fxrq desc",
			// 表格双击事件
			onitemdoubleclick : me.controller._dataGrid_onitemdoubleclick,
			onload : me.controller._dataGrid_onload,
			entityContainer : gridEntityContainer
		});
    	var editor = _dataGrid.pageNaviBar.getPageSizeEditor();
		editor.setWidth("50px");

	    // 将工具栏放到查询区后
		//me.toolBar.$e.insertAfter(_dataGrid.searchBox.$e);
		// 隐藏表格的放大镜
		_dataGrid.$("#toggleShowBtn").hide();
        /*
        // 设置查询区label右对齐
		_dataGrid.searchBox.$(".caption").css("textAlign", "right");
		_dataGrid.searchBox.$(".buttonTd").css("padding-right", "68px");
		// 重写查询区的getHeight方法，当隐藏和展开查询区时会调用该方法，根据isHidden获取grid的top值
		_dataGrid.searchBox.getHeight = function() {
			if (_dataGrid.searchBox._isHidden) {
				return 58;
			} else {
				return 146;
			}
		}*/
        me.mainVSplit.addControl(_dataGrid, 1);
        /*
		// 给设备类型添加树节点双击事件
		_dataGrid.searchBox.editors.sblx.dataTree.on("nodedoubleclick",me.controller._dataGrid_searchBox_sblx_nodedoubleclick);
		// 给发现班组添加树节点双击事件
        _dataGrid.searchBox.editors.fxbzid.dataTree.on("nodedoubleclick",me.controller._dataGrid_searchBox_fxbzid_nodedoubleclick);
        */
	}

	  /**
     * 初始化表单视图窗口对象
     */
    function _initDetailWindow(){
        /*
    	me.detailWin = mxpms.utils.PortalUtil.getGlobalWindowManage().create({
			reusable: true,//是否复用
			width:900,
			height:500,
			top : "center",
			left : "center",
			title:"流程信息"
        });
        */
    }
    
	/**
	 * 初始化消息提示框
	 */
	function _initMessageBox() {
		me.msgBox = new mx.windows.MessageBox({
			reusable : true,// 一个Boolean值，表示弹出窗口是否可重用。
			showOkButton : true,// 一个Boolean值，表示是否显示确定按纽。
			showCancelButton : true// 一个Boolean值，表示是否显示取消按纽。
		});
	}

	/**
	 * 获取DataGrid网格列表对象
	 */
	me.getDataGrid = function() {
		return _dataGrid;
	}

	me.endOfClass(arguments)
	return me;
};