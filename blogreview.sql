﻿
CREATE DATABASE IF NOT EXISTS meizu default charset utf8 ;
use meizu;
-- ----------------------------
-- Table structure for `blogreview`
-- ----------------------------
DROP TABLE IF EXISTS `subscriptions_info`;
CREATE TABLE `subscriptions_info` (
  `id`              int(11) NOT NULL auto_increment,
  `name`            varchar(128) default NULL,
  `headpath`        varchar(1024) default NULL,
  `description`     varchar(1024) default NULL,
  `password`        varchar(128) default NULL,
  `openid`          varchar(128) default NULL,
  `token`           varchar(128) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
 
INSERT INTO `subscriptions_info` VALUES (1, 'test', 'test', '骁龙845 屏幕下指纹',  '2222555ds2f', '2699', 'eeeeeeeeeeeeeeeeeeeeee');



-- ----------------------------
-- Table structure for `article_list`
-- ----------------------------
DROP TABLE IF EXISTS `article_list`;
-- CREATE TABLE `article_list` (
--   `blog_id`         int(11) NOT NULL auto_increment,
--   `title`             varchar(128) default NULL,
--   `desc`            varchar(128) default NULL,
--   `image_url`         varchar(128) default NULL,
--   `date`              datetime default NULL,
--   `subscripttion_id`  int(11) default NULL,

--   PRIMARY KEY  (`blog_id`)
-- ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
    
-- INSERT INTO `article_list` VALUES (1,'testtitle','test desc','tese-img-url','2019/09/09',1);


CREATE TABLE `article_list` (
  `blog_id`         int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title`           varchar(255) NOT NULL COMMENT '标题',
  `thumb_url`       varchar(255) NOT NULL COMMENT '文章封面',
  `thumb_media_id`  varchar(255) DEFAULT NULL COMMENT '图文消息的封面图片素材id（必须是永久mediaID）',
  `show_cover_pic`  tinyint(10) DEFAULT NULL COMMENT '是否显示封面，0为false，即不显示，1为true，即显示',
  `author`          varchar(100) DEFAULT NULL COMMENT '作者',
  `digest`          varchar(255) DEFAULT NULL COMMENT '图文消息的摘要，仅有单图文消息才有摘要，多图文此处为空。如果本字段为没有填写，则默认抓取正文前64个字。',
  `content`         text COMMENT '图文消息的具体内容，支持HTML标签，必须少于2万字符，小于1M，且此处会去除JS,涉及图片url必须来源 "上传图文消息内的图片获取URL"接口获取。外部图片url将被过滤。',
  `url`             varchar(255) DEFAULT NULL COMMENT '图文页的URL',
  `content_source_url` varchar(255) DEFAULT NULL COMMENT '图文消息的原文地址，即点击“阅读原文”后的URL',
  `update_time`     datetime DEFAULT NULL COMMENT '更新时间',
  `create_time`     datetime DEFAULT NULL COMMENT '创建时间',
  `subscripttion_id`  int(10) default NULL,
  PRIMARY KEY (`blog_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


-- ----------------------------
-- Table structure for `user_info`
-- ----------------------------
DROP TABLE IF EXISTS `user_info`;
CREATE TABLE `user_info` (
  `uid`     int(11) NOT NULL auto_increment,
  `uname`     varchar(32) default NULL,
  `avatarUrl`  varchar(1024) default NULL,
  `country`   varchar(16) default NULL,
  `city`     varchar(128) default NULL,
  `province`   varchar(128) default NULL,
  `gender`   int(1) default NULL,
  `language` varchar(32) default NULL,
  `token`    varchar(128) default NULL,
  PRIMARY KEY  (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=91 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user_info
-- ----------------------------
INSERT INTO `user_info` (`uid`, `uname`, `avatarUrl`, `country`, `city`, `province`, `gender`, `language` , `token`) VALUES
                        (1, 'test', 'test-img', 'china', 'shanghai', 'shanghai', 0 , 'zh-cn', NULL),

                        (2, '1111', '111111', 'china', 'shanghai', '深圳市--',1, NULL, NULL);



-- ----------------------------
-- Table structure for `user_message`
-- ----------------------------
DROP TABLE IF EXISTS `user_message`;
CREATE TABLE `user_message` (
  `u_message_id`	      int(11) NOT NULL ,
  `uid`	               int(11) NOT NULL ,
  `blog_id`             int(11) NOT NULL ,
  `user_message`      varchar(1024) default NULL,
  `author_message`	  int(11) NOT NULL ,
  `is_top`            int(11) default NULL,
  `is_show`           int(11) NOT NULL ,
  
  `like_number`       varchar(64) default NULL,
  `token`             varchar(128) default NULL,
  PRIMARY KEY  (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user_message
-- ----------------------------




-- ----------------------------
-- Table structure for `user_message`
-- ----------------------------
DROP TABLE IF EXISTS `user_message_likes`;
CREATE TABLE `user_message_likes` (
  `u_msg_like_id`   int(11) NOT NULL auto_increment,
  `uid`	               int(11) NOT NULL ,
  `blog_id`             int(11) NOT NULL ,
  `like_date`         datetime default NULL,
  `token`             varchar(128) default NULL,
  PRIMARY KEY  (`u_msg_like_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

