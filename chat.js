var ws;
var SocketCreated = false;
var isUserloggedout = false;
function lockOn(str){
	var lock = document.getElementById('skm_LockPane');
	if(lock)lock.className = 'LockOn'; 
	lock.innerHTML = str;
} 
function lockOff(){
	var lock = document.getElementById('skm_LockPane'); 
	lock.className = 'LockOff'; 
}
function ToggleConnectionClicked(){
	if(SocketCreated && (ws.readyState == 0 || ws.readyState == 1)){
lockOn("离开聊天室...");  
		SocketCreated = false;
		isUserloggedout = true;
ws.close();
}else{
		lockOn("进入聊天室...");  
		Log("正在为您匹配客服人员...");
try{
			if("WebSocket" in window){
ws = new WebSocket("ws://" + document.getElementById("Connection").value);
			}
			else if("MozWebSocket" in window){
ws = new MozWebSocket("ws://" + document.getElementById("Connection").value);
			}
			SocketCreated = true;
			isUserloggedout = false;
}catch(ex){
			Log(ex,"ERROR");
			return;
		}
		document.getElementById("ToggleConnection").innerHTML = "断开";
ws.onopen = WSonOpen;
		ws.onmessage = WSonMessage;
		ws.onclose = WSonClose;
		ws.onerror = WSonError;
	}
};
function WSonOpen(){
	lockOff();
	Log("已成功为您匹配到客服人员", "OK");
$("#SendDataContainer").show();
	ws.send("login:" + document.getElementById("txtName").value);
};
function WSonMessage(event){
	Log(event.data);          
};
function WSonClose(){
	lockOff();
	if(isUserloggedout){
		Log("【"+document.getElementById("txtName").value+"】离开了聊天室");
document.getElementById("ToggleConnection").innerHTML = "连接";
		$("#SendDataContainer").hide();
}
};
 
function WSonError(){
	lockOff();
	Log("远程连接中断", "ERROR");
};
 
function SendDataClicked(){
	if(document.getElementById("DataToSend").value.trim() != ""){
ws.send(document.getElementById("txtName").value + "说 :\"" + document.getElementById("DataToSend").value + "\"");
		
document.getElementById("DataToSend").value = "";
	}

}
};
 
function Log(Text,MessageType){
if(MessageType == "OK") Text = "<span style='color: green;'>" + Text + "</span>";
	
if(MessageType == "ERROR") Text = "<span style='color: red;'>" + Text + "</span>";
	
document.getElementById("LogContainer").innerHTML = document.getElementById("LogContainer").innerHTML + Text + "<br/>";
var LogContainer = document.getElementById("LogContainer");
	LogContainer.scrollTop = LogContainer.scrollHeight;
};
$(document).ready(function(){
	$("#SendDataContainer").hide();
	var WebSocketsExist = true;
/* try{
		var dummy = new WebSocket("ws://localhost:8989/chat");
	}catch(ex){
try{
			webSocket = new MozWebSocket("ws://localhost:8989/chat");
		}catch(ex){
WebSocketsExist = false;
		}
	} */
if(WebSocketsExist){
		Log("您好，我们将竭诚为您服务！", "OK");
		document.getElementById("Connection").value = "192.168.0.54:4141/chat";
	}else{
Log("糟糕，出错了...", "ERROR");
		document.getElementById("ToggleConnection").disabled = true;
	}
	$("#DataToSend").keypress(function(evt){
if(evt.keyCode == 13){
			$("#SendData").click();
			evt.preventDefault();
		}
	})
});
