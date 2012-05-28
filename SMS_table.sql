-- may one content send by both end user and sp+gid+, that case, it must use two record for them
-- 0x  system function, total=9
-- 1xx, big and import gid/org/enterprise, total=100, manual assigned
-- 2xxx - 9xxx, other gids, total = 8000, automatically assigned

-- Create table
create table SMS_CONTENT_T
(
  CID         NUMBER(16) not null,
  ENCODE      VARCHAR2(30),
  CONTENT     VARCHAR2(2000) not null,
  SENDER      VARCHAR2(11),
  PAYER       varchar2(11),
  INSERT_TIME DATE default sysdate not null,
  TAR_COUNT   NUMBER(6)
);

-- Add comments to the columns
comment on column SMS_CONTENT_T.CID
  is 'SMS content index ID';

comment on column SMS_CONTENT_T.ENCODE
  is 'maybe unicode or special charset, or binary encoded with base64 encoding';

comment on column SMS_CONTENT_T.CONTENT
  is 'SMS content, may have :1 :2 placeholder';

comment on column SMS_CONTENT_T.SENDER
  is 'sender: for SMPP, from mobile user number; for SGIP SP, trailing number after SP number';

comment on column SMS_CONTENT_T.PAYER
  is 'for SGIP submit, specify who pay for the bill, 0 for free, null for SMPP';

comment on column SMS_CONTENT_T.TAR_COUNT
  is 'number of target numbers';

-- Create/Recreate primary, unique and foreign key constraints
alter table SMS_CONTENT_T
  add constraint PK_SMS_CONTENT primary key (CID)
;

-- Create/Recreate indexes
create index IX_SMS_SENDER on SMS_CONTENT_T (SENDER)
  compress;

create index IX_SMS_PAYER on SMS_CONTENT_T (nullif(PAYER,'0'))
  compress;


Create table SP_SMS_T
(
  SRC_NODE_ID   NUMBER(10),
  CMD_TIME      DATE,
  CMD_SEQ       NUMBER(10),
  target        VARCHAR2(24),
  CID            NUMBER(16),
  SUBSTITUTES    VARCHAR2(100),
  BYTES          NUMBER(4),
  REPORT_FLAG    CHAR(1),
  DISPOSAL_STS   CHAR(1) default 'W',
  RET_CODE       NUMBER,
  STATUS_TIME    DATE,
  reply         varchar2(254)
);
-- Add comments to the table
comment on table SP_SMS_T
  is 'SP SMS send pool';
-- Add comments to the columns
comment on column SP_SMS_T.SRC_NODE_ID
  is 'SP NODE ID for SGIP';
comment on column SP_SMS_T.CMD_TIME
  is 'SMS create time';
comment on column SP_SMS_T.CMD_SEQ
  is 'SMS sequence for SGIP';

comment on column SP_SMS_T.target
  is 'target user number';
comment on column SP_SMS_T.CID
  is 'content index ID';
comment on column SP_SMS_T.SUBSTITUTES
  is 'substitude values';
comment on column SP_SMS_T.BYTES
  is 'bytes of SMS content';
comment on column SP_SMS_T.REPORT_FLAG
  is 'if report needed, Y,N,null(default as N)';

comment on column SP_SMS_T.DISPOSAL_STS
  is 'W waiting, Q queue for flow control, S reach SMG, 0 final failure, 1 final success';
comment on column SP_SMS_T.RET_CODE
  is 'return code from SMG';
comment on column SP_SMS_T.STATUS_TIME
  is 'time of status update';
comment on column SP_SMS_T.REPLY
  is 'user replay if it have';


-- Create/Recreate primary, unique and foreign key constraints
alter table SP_SMS_T
  add constraint PK_SP_SMS primary key (SRC_NODE_ID,CMD_TIME,CMD_SEQ,target)
  ;
alter table SP_SMS_T
  add constraint FK_SP_SMS_CID foreign key (CID)
  references SMS_CONTENT_T (CID) on delete cascade;


-- Create sequence
create sequence S_CID
minvalue 1
maxvalue 9999999999999999
start with 1
increment by 1
cache 10;


-- Create sequence
create sequence s_sp_zx
minvalue 0
maxvalue 4294967295
start with 0
increment by 1
cycle
nocache;

create sequence s_sp_hy
minvalue 0
maxvalue 4294967295
start with 0
increment by 1
cycle
nocache;
