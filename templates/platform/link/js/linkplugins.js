/*
 * link plugins
 * version : 3.2
 * author : yulsh
 * date : 2015-4-9
 */
;(function (window) {
    /**
        Link专属插件类
        @class app.link
    */
    window.app.link = window.app.link || {};

	/*=====================================用户登陆========================================*/
    /**
            该接口用于获取Link登陆后的用户信息
              具体包括： loginId,password,userId,db_loginId,userName,sex,email,orgName,picture,picture_local等信息
        @method app.link.getLoginInfo
        @static
        @param callback {Function} 回调函数，返回json对象
        @example
			app.link.getLoginInfo(function(result){
				app.alert(result); 
			});
    */
    app.link.getLoginInfo = function (callback) {
        var successCallback = function (result) {
            callback(app.utils.toJSON(result));
        };
        Cordova.exec(successCallback, null, "LinkPlugin", "getLoginInfo", []);
	}
       
    /**
        该接口用于获取登录用户的AccessToken
        @method app.link.getToken
        @static
        @param callback {Function} 回调函数,返回json对象
        @example 
            app.link.getToken(function (result) {
                 app.alert(result.accessToken,null,"获取accesstoken");
            });
    */
    app.link.getToken = function (callback) {
        var successCallback = function (result) {
            callback(app.utils.toJSON(result));
        };
        Cordova.exec(successCallback, null, "LinkPlugin", "getToken", []);
    }

	/*======================================通讯录=========================================*/
    /**
        该接口用于获取Link指定的用户信息，具体包括：loginId,userId,userName,telephone,orgName,sex,email,picture,picture_local等信息。
        @method app.link.getUserInfo
        @static
        @param callback {Function} 成功回调函数，返回json对象
        @param failCallback {Function} 失败回调函数，返回错误字符串
        @param userId {String} 指定用户的id
        @example
            app.link.getUserInfo(function(result){  
                app.alert(result.userName);
            },
            function(error){
                app.alert(error);
            },
            'ebdfe3b1-ed9c-425b-aac3-aa6c61d05d0e'
            );
    */
    app.link.getUserInfo = function (callback, failCallback, userId) {
            var successCallback = function (result) {
            callback(app.utils.toJSON(result));
        };
        Cordova.exec(successCallback, failCallback, "LinkPlugin", "getUserInfo", [userId]);
    }

    /*
	根据手机或者邮箱获取用户信息
	@method app.link.getUserInfoByCellphoneOrEmail
	@static
	@param key {String} 目前支持传入
    */
    app.link.getUserInfoByCellphoneOrEmail= function(key,callback){
    	 var successCallback = function (result) {
            callback(app.utils.toJSON(result));
        };
    	Cordova.exec(successCallback, null, "LinkPlugin", "getUserInfoByCellphoneOrEmail", [key]);
    }

    /*
	执行同步服务
	@method app.link.execSyncService
	@param type{int} 同步类型。 0：用户信息同步，1：群组信息同步，2：部门信息同步，3：服务号信息同步，4：好友企业同步，5：应用同步
	@static
    */
    app.link.execSyncService=function(type){
    	Cordova.exec(null, null, "LinkPlugin", "execSyncService", [type]);
    }

    
    /**
      	 根据LoginId获取UserId
	    @method app.link.getUserIdWithLoginId
	    @static
	    @param successCallback {Function} 成功回调，返回UserId
        @param failCallback {Function} 失败回调函数，返回错误字符串
	    @param loginId {String} 用户登录Id
		@example 
			app.link.getUserIdWithLoginId(function(res){
				app.alert(res);
			},function(error){
				app.alert(error);
			}, 'lufeng');
    */
    app.link.getUserIdWithLoginId = function (successCallback,failCallback,loginId) {
        Cordova.exec(successCallback,failCallback , "LinkPlugin", "getUserIdWithLoginId", [loginId]);
    }


    /**
		根据部门id获取用户信息以及子部门信息
		@method app.link.getChildListByOrgId
		@static
		@param callback {Function} 回调函数，返回某部门下的用户以及子部门
		@param orgId {String} 部门id
    */
    app.link.getChildListByOrgId=function(callback,orgId){
    	 Cordova.exec(callback,null , "LinkPlugin", "getChildListByOrgId", [orgId]);

    }

    /**
		根据部门id获取该部门的信息
		@method app.link.getDeptInfoByOrgId
		@static
		@param callback {Function} 回调函数，返回部门信息
		@param orgId {String} 部门id
    */
    app.link.getDeptInfoByOrgId=function(callback,orgId){
    	 Cordova.exec(callback,null , "LinkPlugin", "getDeptInfoByOrgId", [orgId]);
    }
    

    /**
		该接口用于调用Link选人页面(单选)
        @method app.link.startContactSingleSelector
        @static
        @param successCallback {Function} 成功回调函数,返回json对象
        @param failCallback {Function} 失败回调函数，返回错误字符串
        @param title {String} 选人窗口文字说明
        @param dataType {String} 选择范围：1为用户,2为群组,3为用户+群组 4为部门(组织),5为用户+组织
        @param extraParams json对象，方便后面扩展，目前有isIncludeDisableUser(是否包含禁用的用户，默认false)
        @example 
			app.link.startContactSingleSelector(function(result){
		        app.alert(result);
			},function(){} ,'请选择用户','1');

    */
    app.link.startContactSingleSelector = function (successCallback, failCallback,title, dataType,extraParams) {
         extraParams = $.extend({
            isIncludeDisableUser:false
        }, extraParams);
        Cordova.exec(successCallback, failCallback, "LinkPlugin", "startContactSingleSelector", [title, dataType,extraParams]);
    }

    /**
		该接口用于调用Link选人界面(多选)
        @method app.link.startContactMulitSelector
        @static
        @param successCallback {Function} 成功回调函数,返回json对象
        @param failCallback {Function} 失败回调函数，返回错误字符串
        @param title {String} 选人窗口文字说明
        @param dataType {String} 选择范围：1为用户,2为群组,3为用户+群组 4为部门(组织),5为用户+组织
        @param extraParams {Object} json对象,具体可以传入哪些请参看代码
        @example 
			app.link.startContactMulitSelector(
			
			    function(result){
			        app.alert(result);
			        //todo
			    },
			    function(error){
			        //app.alert(error);
			    },
			    '请选择用户/群组(多选)',
			    '1',
			    {   
			        userSelected: [],          //默认选中的用户 id
			        groupSelected: [],         //默认选中的群组id
			        organizationSelected: [],  //默认选中的部门id
			        userIgnore: [], 		   //禁止选择的用户id
			        groupIgnore: [], 		   //禁止选择的群组id
			        organizationIgnore: [],    //禁止选择的部门id
			        isIncludeDisableUser:false //是否包含被禁用的人员， 默认是false
			    }
			);
    */
    app.link.startContactMulitSelector = function (successCallback, failCallback, title, dataType, extraParams) {
        extraParams = $.extend({
            userSelected: [],
            groupSelected: [],
            organizationSelected: [],
            userIgnore: [],
            groupIgnore: [],
            organizationIgnore: [],
            isIncludeDisableUser:false
        }, extraParams);
        Cordova.exec(successCallback, failCallback, "LinkPlugin", "startContactMulitSelector", [title, dataType, extraParams]);
    }
    
    /**
		该接口用于调用Link里面用户的名片页面
        @method app.link.startUserCard
        @static
        @param userId {String} 用户id
        @example
			app.link.startUserCard('ebdfe3b1-ed9c-425b-aac3-aa6c61d05d0e');
    */
    app.link.startUserCard = function (userId) {
        Cordova.exec(null, null, "LinkPlugin", "startUserCard", [userId]);
    }

    /**
		该接口用于调用Link里面群组的名片页面
        @method app.link.startGroupCard
        @static
        @param groupId {String} 群组id
        @example
			app.link.startGroupCard('1456fa37-ebc9-4123-88c0-8b494bab7377');
    */
    app.link.startGroupCard = function (groupId) {
        Cordova.exec(null, null, "LinkPlugin", "startGroupCard", [groupId]);
    }
	
	/**
		创建群组
		@method app.link.createGroup
		@static
		@param successCallback {Function} 成功回调函数,返回json对象
		@param failCallback {Function} 失败回调函数，返回错误字符串
		@param userIds {Array} 默认添加的用户id
		@example   
			app.link.createGroup(
				function(result){
				    app.alert(result);
				    //todo
				},
				function(error){
				    //app.alert(error);
				},
				[]  //默认选择的用户id
			);	
	 */
	app.link.createGroup = function (successCallback, failCallback, userIds) {
        var params={
            code:"OpenBuiltIn",
            key:"CreateGroup",
            userSelected : userIds || []
        };
        Cordova.exec(successCallback, failCallback, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);	
	}
	
 	/**
		打开群组列表 
		@method app.link.openGroupList
		@static
		@param sCode {String} 企业编码sCode，默认不传，企业互联才需要传
		@example
			app.link.openGroupList(); 
	 */
	app.link.openGroupList = function (sCode) {
        var params={
            code:"OpenBuiltIn",
            key:"GroupList"
        };
        if(sCode) {
        	params.sCode = sCode;
        }
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);	
	}
	
	/**
		打开群组发公告页面 
		@method app.link.sendGroupNotice
		@static
		@param groupId {String} 群组id
		@example
			app.link.sendGroupNotice('1456fa37-ebc9-4123-88c0-8b494bab7377');
	 */
	app.link.sendGroupNotice = function (groupId) {
        var params={
            code:"OpenBuiltIn",
            key:"PublishGroupAnnouncement",
            groupId : groupId
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);	
	}    
	
	/**
		打开群组公告列表 
		@method app.link.openGroupNoticeList
		@static
		@param groupId {String} 群组id
		@example
			app.link.openGroupNoticeList('1456fa37-ebc9-4123-88c0-8b494bab7377');
	 */
	app.link.openGroupNoticeList = function (groupId) {
        var params={
            code:"OpenBuiltIn",
            key:"GroupAnnouncementList",
            groupId : groupId
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);	
	}    	
	
	/**
		打开群组签到列表 
		@method app.link.openGroupCheckInList
		@static
		@param groupId {String} 群组id
		@example
			app.link.openGroupCheckInList('1456fa37-ebc9-4123-88c0-8b494bab7377');
	 */
	app.link.openGroupCheckInList = function (groupId) {
        var params={
            code:"OpenBuiltIn",
            key:"MyCheckIn",
            groupId : groupId
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);	
	}  
	
	/**
		打开部门列表 
		@method app.link.openOrgList
		@static
		@param orgId {String} 部门id（可不传）
		@example
			app.link.openOrgList();
	 */
	app.link.openOrgList = function (orgId) {
        var params={
            code:"OpenBuiltIn",
            key:"OrganizationList",
            orgId : orgId || ''
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);	
	}  

	/**
		查看部门名片页
		@method app.link.openOrgCard
		@static
		@param orgId {String} 部门id
		@example
			app.link.openOrgCard('02af68fb-dc53-4411-b6c8-d6480cce2234');
	 */
	app.link.openOrgCard = function (orgId) {
        var params={
            code:"OpenBuiltIn",
            key:"OrganizationCard",
            orgId : orgId
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);	
	}  

	/**
		发送服务号公告
		@method app.link.sendServiceAccountNotice
		@static
		@param accountId {String} 服务号id
		@param bulletinType {Int} 公告类型(1文字,2图片,3语音) | 不传此参数时先进入公告类型选择页面
		@example
			app.link.sendServiceAccountNotice("43b80351-2c0a-4e84-a3d0-43eb7d35bc00");
	 */
	app.link.sendServiceAccountNotice = function (accountId, bulletinType) {
        var params={
            code:"OpenBuiltIn",
            key:"SendBulletin",
            accountId : accountId,
            bulletinType : bulletinType
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);	
	}  
	
	/**
		查看服务号名片页 
		@method app.link.openServiceAccountCard
		@static
		@param accountId {String} 服务号id
		@example
			app.link.openServiceAccountCard("43b80351-2c0a-4e84-a3d0-43eb7d35bc00");
	 */
	app.link.openServiceAccountCard = function (accountId) {
        var params={
            code:"OpenBuiltIn",
            key:"ServiceAccountCard",
            accountId : accountId
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);	
	}  

	/**
		查看已关注服务号列表 
		@method app.link.openServiceAccountList
		@static
		@example
			app.link.openServiceAccountList();
	 */
	app.link.openServiceAccountList = function () {
        var params={
            code:"OpenBuiltIn",
            key:"ServiceAccountList"
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);	
	} 
	
	/**
		打开添加服务号页面
		@method app.link.addServiceAcccount
		@static
		@example
			app.link.addServiceAcccount();		
	 */
	app.link.addServiceAcccount = function () {
        var params={
            code:"OpenBuiltIn",
            key:"AddServiceAccount"
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);	
	} 

	/**
		打开通讯录页面 
		@method app.link.openContactPage
		@static
		@example
			app.link.openContactPage();
	 */
	app.link.openContactPage = function () {
        var params={
            code:"OpenBuiltIn",
            key:"Contact"
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);	
	} 
	
	/*=======================================消息==========================================*/
	/**
		打开消息中心页面  newfunction
		@method app.link.openMsgCenter
		@static
		@example
			app.link.openMsgCenter();		
	 */
	app.link.openMsgCenter = function (isShowService) {
        var params={
            code:"OpenBuiltIn",
            key:"MessageCenter",
            isShowService : isShowService
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);	
	} 
	
    /**
		获取未读消息总数
		@method app.link.getUnreadMessageCount
		@static
		@param successCallback {Function} 成功回调，返回数字
		@param failCallback {Function} 失败回调,返回失败信息
		@example
			app.link.getUnreadMessageCount(function(result){
			     alert(result);
			},function(error){
				 app.alert(error);
			});
    */
    app.link.getUnreadMessageCount = function (successCallback, failCallback) {
        Cordova.exec(successCallback, failCallback,"LinkPlugin", "getUnreadMessageCount", []);
    }

    /**
		该方法用于获取指定帐号id的未读消息数
		@method app.link.getUnreadMessageCountById
		@static
		@param successCallback {Function} 成功回调函数，返回未读消息数
		@param talkWithId {String} 这里的帐号包括：用户的id，服务号的id，部门的id，群组的id
		@example
			app.link.getUnreadMessageCountById(function(result){
			 	alert(result);
			}, 'ebdfe3b1-ed9c-425b-aac3-aa6c61d05d0e'); 
    */
    app.link.getUnreadMessageCountById=function(successCallback,talkWithId){
        var callback=function(result){
            successCallback(result,talkWithId);
        }
        Cordova.exec(callback,null,"LinkPlugin","getUnreadMessageCountById",[talkWithId]);
    }
	
    /**
		该接口用于调用Link的用户聊天页面
        @method app.link.startUserChat
        @static
        @param userId {String} 用户id
        @param userName {String} 用户名称(可选)
        @example 
            app.link.startUserChat('ebdfe3b1-ed9c-425b-aac3-aa6c61d05d0e');
    */
    app.link.startUserChat = function (userId, userName) {
        Cordova.exec(null, null, "LinkPlugin", "startUserChat", [userId, userName]);
    }

    /**
		该接口用于调用Link的群组聊天页面
        @method app.link.startGroupChat
        @static 
        @param groupId {String} 群组id
        @param groupName {String} 群组名称(可选)
        @example
            app.link.startGroupChat('1456fa37-ebc9-4123-88c0-8b494bab7377');
    */
    app.link.startGroupChat = function (groupId, groupName) {
        Cordova.exec(null, null, "LinkPlugin", "startGroupChat", [groupId, groupName]);
    }

	/**
		打开服务号聊天界面 
		@method app.link.startServiceAccountChat
		@static
		@param accountId {String} 服务号id
		@example 
			app.link.startServiceAccountChat("43b80351-2c0a-4e84-a3d0-43eb7d35bc00");
	 */
	app.link.startServiceAccountChat = function (accountId) {
        Cordova.exec(null, null, "LinkPlugin", "startServiceAccountChat", [accountId]);
	} 

	//发送邀约消息（主要用在消息窗口）
	//{toId:,toType:,title:,desc:,action_params:}
	app.link.sendInviteMessage=function(params){
		params=params||{};
		Cordova.exec(null, null, "LinkPlugin", "sendInviteMessage", [params]);
	}




 	/*=======================================动态==========================================*/
    /**
		发表动态 
		@method app.link.publishMicroblog
		@static
		@param successCallback {Function} 成功回调
		@param failCallback {Function} 失败回调,返回失败信息
		@param options {JSONObject} 动态参数，具体如下：<br/>
			authorID {String} 发表动态的对象id ， 可以是用户或用户运营的服务号 （不写默认是当前用户）<br/>
			content {String} 动态内容<br/>
			privateType {Int}  私密类型 ， 0 群组，  1 部门， 2 个人 ， 3 项目  ， 4公开 （默认类型）<br/>
			privateInstanceID {String}  私密对象id<br/>
			privateName {String} 私密对象名称<br/>
			images {Array}  动态图片 （相册图片地址， 建议到动态发表界面再选择图片，这样更加方便）
		@example
			app.link.publishMicroblog(function(res){
				app.alert(res);
			},function (error) {
				app.alert(error);
			},{
				content : '这是发布到link的一条动态!!'
			});
		
    */
    app.link.publishMicroblog=function(successCallback, failCallback, options){
         var params = $.extend({
            code:"OpenBuiltIn",
            key:"PublishMicroBlog" 	
        },options);
        Cordova.exec(successCallback, failCallback, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

    /**
		打开动态主页 
		@method app.link.openMicroblogPage
		@static
		@param displayType {Int} 显示类型<br/>
		0 全部<br/>
		1 官方<br/>
		2 群组<br/>
		3 个人<br/>
		4 我的动态<br/>
		5 相互关注<br/>
		6 项目<br/>
		7 随便逛逛
		@example
			app.link.openMicroblogPage(0);
    */
    app.link.openMicroblogPage=function(displayType){
    	
    	displayType = ( displayType >=0 && displayType <= 7 ) ? displayType : 0;  	
        var params={
            code:"OpenBuiltIn",
            key:"DcMicroBlog",
            displayType:displayType
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }
    
    /**
		打开某人动态主页 
		@method app.link.openUserMicroblog
		@static
		@param accountName {String} 用户名称
		@example
			app.link.openUserMicroblog('余龙生');
    */
    app.link.openUserMicroblog=function(accountName){
        var params={
            code:"OpenBuiltIn",
            key:"BlogCard",
            accountName : accountName
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }
    
    /**
		 打开某群组动态主页 
		@method app.link.openGroupMicroblog
		@static
		@param groupId {String} 群组id
		@example
			app.link.openGroupMicroblog('1456fa37-ebc9-4123-88c0-8b494bab7377');	
    */
    app.link.openGroupMicroblog=function(groupId){
        var params={
            code:"OpenBuiltIn",
            key:"GroupBlogList",
            groupId:groupId
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }
       
    /*
		打开某项目动态主页  
		@method app.link.startProjectDetail
		@static
		@param: projectId{String} 项目id
		@example
			app.link.startProjectDetail('projectId'); //这里填写你的项目id
    */
    app.link.startProjectDetail = function (projectId) {
        Cordova.exec(null,null, "LinkPlugin", "startProjectDetail", [projectId]);
    }
       
    /**
		打开某服务号动态主页 
		@method app.link.openServiceAccountMicroblog
		@static
		@param accountName {String} 服务号名称
		@example
			app.link.openServiceAccountMicroblog('系统通知');
    */
    app.link.openServiceAccountMicroblog=function(accountName){
        var params={
            code:"OpenBuiltIn",
            key:"BlogCard",
            accountName : accountName
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }
   
	/**
		打开某话题动态主页 
		@method app.link.openTopicMicroblog
		@static
		@param topic {String} 话题名称
		@example
			app.link.openTopicMicroblog('BingoTouch');
    */
    app.link.openTopicMicroblog=function(topic){
        var params={
            code:"OpenBuiltIn",
            key:"TopicBlogList",
            topic :topic
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }
    
    /**
		打开动态广场 
		@method app.link.openBlogSquare
		@static
		@param
		@example
			app.link.openBlogSquare();
    */
    app.link.openBlogSquare=function(){
        var params={
            code:"OpenBuiltIn",
            key:"BlogSquare"
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }
     
    /**
		打开动态详情
		@method app.link.openMicroblogDetail
		@static
		@param
		@example
			app.link.openMicroblogDetail('0683ecc7-560f-4b7e-92a3-6ce9d690e5be');//这里填写你的动态id
    */
    app.link.openMicroblogDetail=function(blogId){
        var params={
            code:"OpenBuiltIn",
            key:"BlogDetail",
            blogId : blogId
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }
    
	/**
		打开我的动态 
		@method app.link.openMyMicroblog
		@static
		@param
		@example
			app.link.openMyMicroblog();
    */
    app.link.openMyMicroblog=function(){
        var params={
            code:"OpenBuiltIn",
            key:"MyMicroBlog"
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }
 	
 	/*=======================================应用==========================================*/ 	
    /**
		该方法用于app里面启动app
    	@method app.link.runApp
		@param params{Object} 启动应用的参数，key-value格式为
	        <br/> { appCode:"应用市场中填写的编码", appUrl:"启动页面相对地址", data:{name:"张三",sex:"male":age:25} }
	        <br/> 其中data参数也是json对象，启动目标应用后，能够在app.getPageParams里面获取到。
   		@example
			var params={
			        appCode:"com.bingo.touch",
			        data:{
			            name:"张三",
			            sex:"male",
			            gender:23
			        }
			    }
			app.link.runApp(params);
    */
    app.link.runApp=function(params){
        var dataStr="";
        if(params.data)
        {
            for (var key in params.data) {
                dataStr+=("\n"+key+"="+params.data[key]);
            };    
        }
       params="[OpenApp]\nappCode="+params.appCode+(params.appUrl?"\nappUrl="+params.appUrl:"")+dataStr;
       Cordova.exec(null, null, "LinkPlugin", "launchLinkService", [params]);
    }
    
  	/**
		打开应用桌面
		@method app.link.openAppDesktop
		@static
		@param
		@example
			app.link.openAppDesktop();
    */
    app.link.openAppDesktop=function(){
        var params={
            code:"OpenBuiltIn",
            key:"DcApp"
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }
 	
 	/**
		打开应用市场
		@method app.link.openAppMarket
		@static
		@param
		@example
			app.link.openAppMarket();
    */
    app.link.openAppMarket=function(){
        var params={
            code:"OpenBuiltIn",
            key:"AppMarket"
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }
 	
 	/**
		打开应用详情页面
		@method app.link.openAppCard
		@static
		@param
		@example
			app.link.openAppCard("com.bingo.touch");
    */
    app.link.openAppCard=function(AppCode){
        var params={
            code:"OpenBuiltIn",
            key:"AppDetail",
            AppCode : AppCode
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }
 		
  	/*=======================================签到==========================================*/ 	   
 	/**
		该方法用于调用Link的“我要签到”界面
		@method app.link.startCheckIn
		@static
		@example
			app.link.startCheckIn();
    */
    app.link.startCheckIn=function(){
        var params="[StartCheckin]\npushToListOnComplete=false";
        Cordova.exec(null, null, "LinkPlugin", "launchLinkService", [params]);
    }

    /**
		该方法用于调用Link的“签到列表”界面
		@method app.link.openCheckInList
    	@static
    	@example
    		app.link.openCheckInList();
    */
    app.link.openCheckInList=function(){
        var params="[OpenBuiltIn]\nkey=MyCheckIn";
        Cordova.exec(null, null, "LinkPlugin", "launchLinkService", [params]);
    }   
 	
  	/**
		打开签到详情页面 
		@method app.link.openCheckInDetail
		@static
		@param checkinId {String} 签到id
		@example
			app.link.openCheckInDetail('04f612d2-0931-48ea-ade8-6de5a382f8fc');
    */
    app.link.openCheckInDetail=function(checkinId){
        var params={
            code:"OpenBuiltIn",
            key:"CheckinDetail",
            checkinId : checkinId
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }
 	
   	/*========================================我===========================================*/ 		
   	/**
		打开个人信息修改页面
		@method app.link.openPersonEdit
		@static
		@example
			app.link.openPersonEdit();
    */
    app.link.openPersonEdit=function(){
        var params={
            code:"OpenBuiltIn",
            key:"EditPersonInfo"
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }
    
    /**
		打开个人设置页面
		@method app.link.openSetting
		@static
		@example
			app.link.openSetting();
    */
    app.link.openSetting=function(){
        var params={
            code:"OpenSubMenu",
            key:"setting",
            module : "MySelf"
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }
    
   	/**
		打开关于页面 
		@method app.link.openAbout
		@static
		@example
			app.link.openAbout();
    */
    app.link.openAbout=function(){
        var params={
            code:"OpenBuiltIn",
            key:"MyAbout"
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }
 	
   	/**
		打开设置消息通知页面 
		@method app.link.openStNotification
		@static
		@example
			app.link.openStNotification();
    */
    app.link.openStNotification=function(){
	   var params={
	  	   code:"OpenBuiltIn",
		   key: 'StNotification'     
	   };
       Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }
    
   	/**
		打开设置手势锁屏页面 
		@method app.link.openStGestureLock
		@static
		@example
			app.link.openStGestureLock();
    */    
    app.link.openStGestureLock=function(){
	   var params={
	  	   code:"OpenBuiltIn",
		   key: 'StGestureLock'     
	   };
       Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }


    /**
		打开手势锁屏页面，如果没有设置，会先弹出设置界面，如果有设置，则直接弹出解锁页面
		@method app.link.CheckGestureLock
		@static
		@example
			app.link.CheckGestureLock();
    */
    app.link.CheckGestureLock=function(callback){
		var params={
			  	   code:"OpenBuiltIn",
				   key: 'CheckGestureLock'     
		};
       Cordova.exec(callback, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);

    }	

   	/**
		打开设置字体大小页面 
		@method app.link.openStFont
		@static
		@example
			app.link.openStFont();
    */
    app.link.openStFont=function(){
	   var params={
	  	   code:"OpenBuiltIn",
		   key: 'StFont'     
	   };
       Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

   	/**
		打开设备管理页面 
		@method app.link.openStDevice
		@static
		@example
			app.link.openStDevice();
    */
    app.link.openStDevice=function(){
	   var params={
	  	   code:"OpenBuiltIn",
		   key: 'StDevice'     
	   };
       Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

   	/**
		打开手工同步页面 
		@method app.link.openStSync
		@static
		@example
			app.link.openStSync();
    */
    app.link.openStSync=function(){
	   var params={
	  	   code:"OpenBuiltIn",
		   key: 'StSync'     
	   };
       Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

   	/**
		打开清除缓存页面 
		@method app.link.openStCleanCache
		@static
		@example
			app.link.openStCleanCache();
    */
    app.link.openStCleanCache=function(){
	   var params={
	  	   code:"OpenBuiltIn",
		   key: 'StCleanCache'     
	   };
       Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

   	/**
		打开修改密码页面 
		@method app.link.openStModifyPassword
		@static
		@example
			app.link.openStModifyPassword();
    */
    app.link.openStModifyPassword=function(){
	   var params={
	  	   code:"OpenBuiltIn",
		   key: 'StModifyPassword'     
	   };
       Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

   	/**
		打开邀请好友页面 
		@method app.link.openStInvite
		@static
		@example
			app.link.openStInvite();
    */
    app.link.openStInvite=function(){
	   var params={
	  	   code:"OpenBuiltIn",
		   key: 'StInvite'     
	   };
       Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

   	/**
		打开Link二维码页面 
		@method app.link.openStQrcode
		@static
		@example
			app.link.openStQrcode();
    */
    app.link.openStQrcode=function(){
	   var params={
	  	   code:"OpenBuiltIn",
		   key: 'StQrcode'     
	   };
       Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

   	/**
		注销Link 
		@method app.link.logout
		@static
		@example
			app.link.logout();
    */
    app.link.logout=function(){
	   var params={
	  	   code:"OpenBuiltIn",
		   key: 'StLogout'     
	   };
       Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }    
 
	/*======================================自由流=========================================*/ 
 	/**
		打开自由流程页面
		@method app.link.startProcess
		@static
		@param processId {String} 流程id
		@param serviceName  {String} 流程名称
		@example
			app.link.startProcess('4b4db781-bdc2-4cfa-a6c0-03cc93bbef3f', '用户反馈'); 
    */
    app.link.startProcess=function(processId, serviceName){
        var params={
            code:"OpenProcess",
            processId : processId,
            serviceName : serviceName
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }
    
    /**
		打开我的工作页面
		@method app.link.openProcessMywork
		@static
		@example
			app.link.openProcessMywork(); 
    */
    app.link.openProcessMywork=function(){
        var params={
            code:"OpenBuiltIn",
            key:"MyWork"
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }
    
	/*=======================================其他=========================================*/     
    /**
		更新Link底部tab角标的数字
		@method app.link.updateTabBadge
		@static
		@param badgeValue {String} 角标的内容，这个内容直接更新到tab里面（当不传此值时去除角标）
		@example
			app.link.updateTabBadge(12);
    */
    app.link.updateTabBadge = function (badgeValue) {
        Cordova.exec(null,null,"LinkPlugin", "updateTabBadge", [badgeValue]);
    }

    /**
		获取当前Link的主题颜色值
		@method app.link.getThemeColor
		@static
		@param successCallback{Function} 成功回调，返回颜色值
		@example
			app.link.getThemeColor(function(res){
				app.alert(res);
			});
    */
    app.link.getThemeColor = function (successCallback) {
    	
    	var callback = function (result) {
    		result.background_color = "#" + result.background_color.substring(3);
    		successCallback(result); //"#ff0072c6"
    	}
        Cordova.exec(callback,null, "LinkPlugin", "getThemeColor", []);
    }

    /*
    @method:启动link里面的服务
    @static
    @param: serviceParam{Object} 组合参数(需要用到请联系产品组)
    */
    app.link.launchLinkService = function (serviceParam) {
        Cordova.exec(null, null, "LinkPlugin", "launchLinkService", [serviceParam]);
    }


    /*
    @method:注册系统消息监听，该接口使用较复杂，请咨询产品组
    注册完成后在页面声明个 function nativeCallback(key, param) 就能够监听到消息了。
    param里面返回  accountType和 accountInstanceId
    @static
    @param: key{String} link内部的key，例如 link_unreadMessageChanged 表示未读消息
    
    */
    app.link.registerReceiver=function(key){
        Cordova.exec(null,null,"NativeBroadCast","registerReceiver",[key]);
    }
    
      /*
	@method:外部内容分享到Link里面
	@static
	@param: params{Object}
		title: {string} 标题
		content: {string} 分享内容摘要
		url: {string} 点击进入的链接
		icon: {string} 分享的图标地址，支持远程地址，或本地图片
		type: {string} WEBSITE,PICTURE,ACTION
    */
    app.link.share=function(params,success,fail){
    	pparams=params||{};
    	params.type=params.type||"WEBSITE";
    	params.content=params.content||"";
    	params.title=params.title||"";
    	params.icon=params.icon||"";
 		Cordova.exec(success, fail, "LinkPlugin", "share", [params]);
    }
    
    //分享到聊天界面(个人/群组)
    app.link.shareToMessage=function(params,success,fail){
    	params=params||{};
    	params.type=params.type||"WEBSITE";
    	params.content=params.content||"";
    	params.title=params.title||"";
    	params.icon=params.icon||"";
    	Cordova.exec(success, fail, "LinkPlugin", "shareToMessage", [params]);
    }
    
     //分享到动态
    app.link.shareToBlog=function(params,success,fail){
    	params=params||{};
    	params.type=params.type||"WEBSITE";
    	params.content=params.content||"";
    	params.title=params.title||"";
    	params.icon=params.icon||"";
    	Cordova.exec(success, fail, "LinkPlugin", "shareToBlog", [params]);
    }
    
    //打开小视频
    app.link.openVideoRecord=function(){
	   var params={
	   	   code:"OpenBuiltIn",
	  	   key:"VideoCapture"
	   };
       Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }
    
    //打开发现服务
    app.link.openDiscoveryService=function(){
    	 var params={
	   	   code:"OpenBuiltIn",
	  	   key:"DcService"
	  	   
	   };
       Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }
    
    //打开二维码扫码
     app.link.ScanCode=function(){
    	 var params={
	   	   code:"OpenBuiltIn",
	  	   key:"ScanCode"
	   };
       Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }
    
        //打开Link内置浏览器
    app.link.openLinkBroswer=function(title,url){
    	 var params={
	   	   code:"OpenUrl",
	   	   title:title,
	  	   url:url
	   	 };
       Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

    //打开BT容器，传入url
    app.link.openBtBroswer=function(url){
    	var params="[BingoTouch]\nurl="+url;
        Cordova.exec(null, null, "LinkPlugin", "launchLinkService", [params]);
    }
    
     
    //打开pdf文件：url支持本地以及远程的地址
    app.link.openPdfBroswer=function(title,url){
		var params={
			name:title,
			uri:url
		}
		if (window.devicePlatform == "android") {
			Cordova.exec(null, null, "LinkPlugin", "fileBrowse", [params]);
		} else if (window.devicePlatform == "iOS") {
			app.link.openLinkBroswer(title,url);
		}
    }

    //获取本地搜藏的服务数据
    app.link.getFavoriteService=function(callback){
    	 var params={
	   	   code:"Data",
	  	   key:"GetFavoriteService"
	   };
       Cordova.exec(callback, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

     /**
            该接口用于选文件
        @method app.link.chooseFile
        @static
        @param callback {Function} 回调函数，返回文件物理地址字符串
        @example
			app.link.chooseFile(function(result){
				app.alert(result); 
			});
    */
   app.link.chooseFile = function (callback) {
        Cordova.exec(callback,null, "LinkPlugin", "chooseFile", []);
    }

})(window);

