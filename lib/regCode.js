/**
 * coding pattern for communication node types
 * AAAA stand for 长途区号，左对齐，右补零
 * X 代表一位序列号
 * QQQQQ 代表5位企业代码
 */
exports.commNodes = {
  SMG : '1AAAAX',
  SMSC : '2AAAAX',
  SP : '3AAAAQQQQQ',
  GNS : '4AAAAX'
}

exports.commCfg = {
  maxRespondeTime : 30, // by seconds
  maxQueuedCmds : 32,
  maxSMG2SMGConns : 15 // max concurrent connection between SMGs
}

exports.defPorts = {
  SMG4SP : 8801,
  SP4SMG : 8801,
  SMG4SMG : 8801,
  GNS4SMG : 8802,
  SMG4GNS : 8803,
  GNS4GNS : 8804,
  SMG4SMGTest : 8810
}

exports.CmdIDs = {
  SGIP_BIND : 0x1,
  SGIP_BIND_RESP : 0x80000001,
  SGIP_UNBIND : 0x2,
  SGIP_UNBIND_RESP : 0x80000002,
  SGIP_SUBMIT : 0x3,
  SGIP_SUBMIT_RESP : 0x80000003,
  SGIP_DELIVER : 0x4,
  SGIP_DELIVER_RESP : 0x80000004,
  SGIP_REPORT : 0x5,
  SGIP_REPORT_RESP : 0x80000005,
  SGIP_ADDSP : 0x6,
  SGIP_ADDSP_RESP : 0x80000006,
  SGIP_MODIFYSP : 0x7,
  SGIP_MODIFYSP_RESP : 0x80000007,
  SGIP_DELETESP : 0x8,
  SGIP_DELETESP_RESP : 0x80000008,
  SGIP_QUERYROUTE : 0x9,
  SGIP_QUERYROUTE_RESP : 0x80000009,
  SGIP_ADDTELESEG : 0xa,
  SGIP_ADDTELESEG_RESP : 0x8000000a,
  SGIP_MODIFYTELESEG : 0xb,
  SGIP_MODIFYTELESEG_RESP : 0x8000000b,
  SGIP_DELETETELESEG : 0xc,
  SGIP_DELETETELESEG_RESP : 0x8000000c,
  SGIP_ADDSMG : 0xd,
  SGIP_ADDSMG_RESP : 0x8000000d,
  SGIP_MODIFYSMG : 0xe,
  SGIP_MODIFYSMG_RESP : 0x0000000e,
  SGIP_DELETESMG : 0xf,
  SGIP_DELETESMG_RESP : 0x8000000f,
  SGIP_CHECKUSER : 0x10,
  SGIP_CHECKUSER_RESP : 0x80000010,
  SGIP_USERRPT : 0x11,
  SGIP_USERRPT_RESP : 0x80000011,
  SGIP_TRACE : 0x1000,
  SGIP_TRACE_RESP : 0x80001000
}
// exports.CmdIDs = CmdIDs;

var ErrCodes = {
  0 : "无错误，命令正确接收",
  1 : "非法登录，如登录名、口令出错、登录名与口令不符等。",
  2 : "重复登录，如在同一TCP/IP连接中连续两次以上请求登录。",
  3 : "连接过多，指单个节点要求同时建立的连接数过多。",
  4 : "登录类型错，指bind命令中的logintype字段出错。",
  5 : "参数格式错，指命令中参数值与参数类型不符或与协议规定的范围不符。",
  6 : "非法手机号码，协议中所有手机号码字段出现非86130号码或手机号码前未加“86”时都应报错。",
  7 : "消息ID错",
  8 : "信息长度错",
  9 : "非法序列号，包括序列号重复、序列号格式错误等",
  10 : "非法操作GNS",
  11 : "节点忙，指本节点存储队列满或其他原因，暂时不能提供服务的情况",
  21 : "目的地址不可达，指路由表存在路由且消息路由正确但被路由的节点暂时不能提供服务的情况",
  22 : "路由错，指路由表存在路由但消息路由出错的情况，如转错SMG等",
  23 : "路由不存在，指消息路由的节点在路由表中不存在",
  24 : "计费号码无效，鉴权不成功时反馈的错误信息",
  25 : "用户不能通信（如不在服务区、未开机等情况）",
  26 : "手机内存不足",
  27 : "手机不支持短消息",
  28 : "手机接收短消息出现错误",
  29 : "不知道的用户",
  30 : "不提供此功能",
  31 : "非法设备",
  32 : "系统失败",
  33 : "短信中心队列满"
};

var BillTypes = {
  0 : "“短消息类型”为“发送”，对“计费用户号码”不计信息费，此类话单仅用于核减SP对称的信道费 ",
  1 : "对“计费用户号码”免费 ",
  2 : "对“计费用户号码”按条计信息费 ",
  3 : "对“计费用户号码”按包月收取信息费 ",
  4 : "对“计费用户号码”的收费是由SP实现 "
}

var UserCondition = {
  0 : '注销',
  1 : '欠费停机',
  2 : '恢复正常'
};

var QueryType = { // 请求类型"
  0 : "全部路由表信息",
  1 : "根据SP接入号码查找SMG",
  2 : "根据手机号码段查找SMG",
  3 : "根据SP接入号码和业务代码查找SMG",
  4 : "根据SMG节点编号查找该SMG所对应全部路由信息"
}

console.log(CmdID);