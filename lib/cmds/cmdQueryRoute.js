var A = require('./../AttrCfg.js')
  , utl = require('../util.js')
  ;

function QueryRoute(QueryType, Number, ServiceTag){
  utl.msgInit(this, arguments);
}
QueryRoute.PDUAttrSeq = [A.QueryType, A.Number, A.ServiceTag];


function QueryRouteResp(Result, Types, Numbers, Marks, Codes, SMGIds, SMGIPs, LoginUsers, Passwords){
  if (Result) {
    if (Types instanceof Array) {
      this.Result = Result;
      this.Count = Types.length;
      this.Type = Types;
      this.Number = Numbers;
      this.Mark = Marks;
      this.Code = Codes;
      this.SMGId = SMGIds;
      this.SMGIP = SMGIPs;
      this.LoginUser = LoginUsers;
      this.Password = Passwords;
    } else {
      this.Result = Result;
      this.Count = 1;
      this.Type = [Types];
      this.Number = [Numbers];
      this.Mark = [Marks];
      this.Code = [Codes];
      this.SMGId = [SMGIds];
      this.SMGIP = [SMGIPs];
      this.LoginUser = [LoginUsers];
      this.Password = [Passwords];
    }
  } else {
    this.Result = Result;
    this.Count = 0;
    this.Type = [];
    this.Number = [];
    this.Mark = [];
    this.Code = [];
    this.SMGId = [];
    this.SMGIP = [];
    this.LoginUser = [];
    this.Password = [];
  }
}

QueryRouteResp.PDUAttrSeq = [A.Result, A.Count, A.Type, A.Number, A.Mark, A.Code, A.SMGId, A.SMGIP, A.LoginUser, A.Password];

QueryRouteResp.prototype.addRoute = function(Type, Number, Mark, Code, SMGId, SMGIP, LoginUser, Password){
  this.Count++;
  this.Type.push(Type);
  this.Number.push(Number);
  this.Mark.push(Mark);
  this.Code.push(Code);
  this.SMGId.push(SMGId);
  this.SMGIP.push(SMGIP);
  this.LoginUser.push(LoginUser);
  this.Password.push(Password);
};

exports.Class = QueryRoute;
QueryRoute.Resp = QueryRouteResp;
