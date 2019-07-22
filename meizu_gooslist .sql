#id,pid, family_id , title ,subtitle , price , spec , banner_url ,img_url
CREATE DATABASE IF NOT EXISTS meizu default charset utf8 ;
use meizu;
-- ----------------------------
-- Table structure for `meizu`
-- ----------------------------
DROP TABLE IF EXISTS `meizu_product`;
CREATE TABLE `meizu_product` (
  `pid`              int(11) NOT NULL auto_increment,
  `family_id`      int(11) default NULL,
  `family_name` varchar(32) default NULL,
  `subtitle`        varchar(128) default NULL,
  `color`            varchar(128) default NULL,
  `price`            decimal(10,2) default NULL,
  `spec`             varchar(64) default NULL,
  PRIMARY KEY  (`pid`)
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8;
 
INSERT INTO `meizu_product` VALUES ('101', '1', '魅族 16th', '骁龙845 屏幕下指纹',  '远山白', '2699', '6+64G');
INSERT INTO `meizu_product` VALUES ('102', '1', '魅族 16th', '骁龙845 屏幕下指纹',  '静夜黑', '2699', '6+64G');
INSERT INTO `meizu_product` VALUES ('103', '1', '魅族 16th', '骁龙845 屏幕下指纹',  '极光蓝', '2799', '6+64G');
INSERT INTO `meizu_product` VALUES ('104', '1', '魅族 16th', '骁龙845 屏幕下指纹',  '远山白', '2999', '6+128G');
INSERT INTO `meizu_product` VALUES ('105', '1', '魅族 16th', '骁龙845 屏幕下指纹',  '静夜黑', '2999', '6+128G');
INSERT INTO `meizu_product` VALUES ('106', '1', '魅族 16th', '骁龙845 屏幕下指纹',  '极光蓝', '3099', '6+128G');
INSERT INTO `meizu_product` VALUES ('107', '1', '魅族 16th', '骁龙845 屏幕下指纹',  '远山白', '3299', '8+128G');
INSERT INTO `meizu_product` VALUES ('108', '1', '魅族 16th', '骁龙845 屏幕下指纹',  '静夜黑', '3299', '8+128G');
INSERT INTO `meizu_product` VALUES ('109', '1', '魅族 16th', '骁龙845 屏幕下指纹',  '极光蓝', '3399', '8+128G');

INSERT INTO `meizu_product` VALUES ('201', '2', '魅族 16x', '骁龙710 轻奢旗舰',  '汝窑白', '2099', '6+64G');
INSERT INTO `meizu_product` VALUES ('202', '2', '魅族 16x', '骁龙710 轻奢旗舰',  '砚墨黑', '2099', '6+64G');
INSERT INTO `meizu_product` VALUES ('203', '2', '魅族 16x', '骁龙710 轻奢旗舰',  '云山蓝', '2099', '6+64G');
INSERT INTO `meizu_product` VALUES ('204', '2', '魅族 16x', '骁龙710 轻奢旗舰',  '汝窑白', '2399', '6+128G');
INSERT INTO `meizu_product` VALUES ('205', '2', '魅族 16x', '骁龙710 轻奢旗舰',  '砚墨黑', '2399', '6+128G');
INSERT INTO `meizu_product` VALUES ('206', '2', '魅族 16x', '骁龙710 轻奢旗舰',  '云山蓝', '2399', '6+128G');

INSERT INTO `meizu_product` VALUES ('301', '3', '魅族移动电源', '双向快充双充电口 轻薄小巧',  '简约白', '78', '双向快充');
INSERT INTO `meizu_product` VALUES ('302', '3', '魅族移动电源', '双向快充双充电口 轻薄小巧',  '静谧黑', '79', '双向快充');

INSERT INTO `meizu_product` VALUES ('311', '4', '魅族无线充电器', '10W快速充电 无线即放即充',  '白色', '99', null);

INSERT INTO `meizu_product` VALUES ('321', '5', 'POP 真无线蓝牙耳机', '六期免息 双无线 零设限',  '皓月白', '499', null);

-- ----------------------------
-- Table structure for `meizu_product_pic`
-- ----------------------------
DROP TABLE IF EXISTS `meizu_product_pic`;
CREATE TABLE `meizu_product_pic` (
  `family_id`      int(11) NOT NULL auto_increment,
  `ban_url1` varchar(128) default NULL,
  `ban_url2` varchar(128) default NULL,
  `ban_url3` varchar(128) default NULL,
  `ban_url4` varchar(128) default NULL,
  `img_url` varchar(1024) default NULL,
  PRIMARY KEY  (`family_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
    
INSERT INTO `meizu_product_pic` VALUES ('1', 
    'http://127.0.0.1:3000/meizu-16th/16th-1.jpg',
    'http://127.0.0.1:3000/meizu-16th/16th-2.jpg',
    'http://127.0.0.1:3000/meizu-16th/16th-3.jpg', 'http://127.0.0.1:3000/meizu-16th/16th-4.jpg',
'<img src="http://127.0.0.1:3000/meizu-16th/16th-info-1.jpg">
<img src="http://127.0.0.1:3000/meizu-16th/16th-info-2.jpg">
<img src="http://127.0.0.1:3000/meizu-16th/16th-info-3.jpg">
<img src="http://127.0.0.1:3000/meizu-16th/16th-info-4.jpg">
<img src="http://127.0.0.1:3000/meizu-16th/16th-info-5.jpg">
<img src="http://127.0.0.1:3000/meizu-16th/16th-info-6.jpg">
<img src="http://127.0.0.1:3000/meizu-16th/16th-info-7.jpg">
<img src="http://127.0.0.1:3000/meizu-16th/16th-info-8.jpg">
<img src="http://127.0.0.1:3000/meizu-16th/16th-info-9.jpg">
<img src="http://127.0.0.1:3000/meizu-16th/16th-info-10.jpg">
<img src="http://127.0.0.1:3000/meizu-16th/16th-info-11.jpg">
<img src="http://127.0.0.1:3000/meizu-16th/16th-info-12.jpg">
<img src="http://127.0.0.1:3000/meizu-16th/16th-info-13.jpg">
<img src="http://127.0.0.1:3000/meizu-16th/16th-info-14.jpg">
<img src="http://127.0.0.1:3000/meizu-16th/16th-info-15.jpg">');

INSERT INTO `meizu_product_pic` VALUES ('2', 
    'http://127.0.0.1:3000/meizu-16x/16x-1.jpg',
    'http://127.0.0.1:3000/meizu-16x/16x-2.jpg',
    'http://127.0.0.1:3000/meizu-16x/16x-3.jpg', 'http://127.0.0.1:3000/meizu-16x/16x-4.jpg',
'<img src="http://127.0.0.1:3000/meizu-16x/16x-info-1.jpg">
<img src="http://127.0.0.1:3000/meizu-16x/16x-info-2.jpg">
<img src="http://127.0.0.1:3000/meizu-16x/16x-info-3.jpg">
<img src="http://127.0.0.1:3000/meizu-16x/16x-info-4.jpg">
<img src="http://127.0.0.1:3000/meizu-16x/16x-info-5.png">
<img src="http://127.0.0.1:3000/meizu-16x/16x-info-6.jpg">
<img src="http://127.0.0.1:3000/meizu-16x/16x-info-7.jpg">
<img src="http://127.0.0.1:3000/meizu-16x/16x-info-8.jpg">
<img src="http://127.0.0.1:3000/meizu-16x/16x-info-9.jpg">
<img src="http://127.0.0.1:3000/meizu-16x/16x-info-10.jpg">
<img src="http://127.0.0.1:3000/meizu-16x/16x-info-11.jpg">
<img src="http://127.0.0.1:3000/meizu-16x/16x-info-12.jpg">
<img src="http://127.0.0.1:3000/meizu-16x/16x-info-13.jpg">');

INSERT INTO `meizu_product_pic` VALUES ('3', 
    'http://127.0.0.1:3000/meizu-dianyuan/dianyuan-1.jpg',
    'http://127.0.0.1:3000/meizu-dianyuan/dianyuan-2.jpg',
    'http://127.0.0.1:3000/meizu-dianyuan/dianyuan-3.jpg', 'http://127.0.0.1:3000/meizu-dianyuan/dianyuan-4.jpg',
'<img src="http://127.0.0.1:3000/meizu-dianyuan/dianyuan-info-1.jpg">
<img src="http://127.0.0.1:3000/meizu-dianyuan/dianyuan-info-2.jpg">
<img src="http://127.0.0.1:3000/meizu-dianyuan/dianyuan-info-3.jpg">
<img src="http://127.0.0.1:3000/meizu-dianyuan/dianyuan-info-4.jpg">
<img src="http://127.0.0.1:3000/meizu-dianyuan/dianyuan-info-5.jpg">
<img src="http://127.0.0.1:3000/meizu-dianyuan/dianyuan-info-6.jpg">
<img src="http://127.0.0.1:3000/meizu-dianyuan/dianyuan-info-7.jpg">');

INSERT INTO `meizu_product_pic` VALUES ('4', 
    'http://127.0.0.1:3000/meizu-usb/usb-1.jpg',
    'http://127.0.0.1:3000/meizu-usb/usb-2.jpg',
    'http://127.0.0.1:3000/meizu-usb/usb-3.jpg', 'http://127.0.0.1:3000/meizu-usb/usb-4.jpg',
'<img src="http://127.0.0.1:3000/meizu-usb/usb-info-1.jpg">
<img src="http://127.0.0.1:3000/meizu-usb/usb-info-2.jpg">
<img src="http://127.0.0.1:3000/meizu-usb/usb-info-3.jpg">
<img src="http://127.0.0.1:3000/meizu-usb/usb-info-4.jpg">
<img src="http://127.0.0.1:3000/meizu-usb/usb-info-5.jpg">
<img src="http://127.0.0.1:3000/meizu-usb/usb-info-6.jpg">
<img src="http://127.0.0.1:3000/meizu-usb/usb-info-7.jpg">');

INSERT INTO `meizu_product_pic` VALUES ('5', 
    'http://127.0.0.1:3000/meizu-headset/headset-1.jpg',
    'http://127.0.0.1:3000/meizu-headset/headset-2.jpg',
    'http://127.0.0.1:3000/meizu-headset/headset-3.jpg', 'http://127.0.0.1:3000/meizu-headset/headset-4.jpg',
'<img src="http://127.0.0.1:3000/meizu-headset/headset-info-1.jpg">
<img src="http://127.0.0.1:3000/meizu-headset/headset-info-2.jpg">
<img src="http://127.0.0.1:3000/meizu-headset/headset-info-3.jpg">
<img src="http://127.0.0.1:3000/meizu-headset/headset-info-4.jpg">
<img src="http://127.0.0.1:3000/meizu-headset/headset-info-5.jpg">
<img src="http://127.0.0.1:3000/meizu-headset/headset-info-6.jpg">
<img src="http://127.0.0.1:3000/meizu-headset/headset-info-7.jpg">
<img src="http://127.0.0.1:3000/meizu-headset/headset-info-8.jpg">
<img src="http://127.0.0.1:3000/meizu-headset/headset-info-9.jpg">
<img src="http://127.0.0.1:3000/meizu-headset/headset-info-10.jpg">
<img src="http://127.0.0.1:3000/meizu-headset/headset-info-11.jpg">
<img src="http://127.0.0.1:3000/meizu-headset/headset-info-12.jpg">
<img src="http://127.0.0.1:3000/meizu-headset/headset-info-13.jpg">');




DROP TABLE IF EXISTS `meizu_user`;
CREATE TABLE `meizu_user` (
  `uid` int(11) NOT NULL auto_increment,
  `uname` varchar(32) default NULL,
  `upwd` varchar(32) default NULL,
  `email` varchar(64) default NULL,
  `phone` varchar(16) default NULL,
  `address` varchar(128) default NULL,
  `user_name` varchar(32) default NULL,
  `gender` int(11) default NULL,
  PRIMARY KEY  (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=91 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of meizu_user
-- ----------------------------
INSERT INTO `meizu_user` (`uid`, `uname`, `upwd`, `email`, `phone`, `address`, `user_name`, `gender`) VALUES
(1, '123456', '123456', 'ding@qq.com', '13511011000', '北京市海淀区魏公村路7号（北理工大学南门西楼2楼）', '丁春秋', 0),
(2, '000', '123456', 'dang@qq.com', '13501234568', '西安市碑林区咸宁西路与兴庆路十字东南角', '当当喵', 1),
(3, 'qwer', '123456', 'dou@qq.com', '13501234569', '南京市鼓楼区汉口路47号2F', '窦志强', 1),
(4, 'dddd', '123456', 'ya@qq.com', '13501234560', '扬州市汶河南路75号文昌广场工人文化宫2楼', '秦小雅', 0),
(5, '1111', '111111', '441977193@qq.com', '18357100796', '深圳市南山区华侨城生态广场A110', NULL, NULL);




DROP TABLE IF EXISTS `meizu_shopcart`;
CREATE TABLE `meizu_shopcart` (
  `shopcart_id` int(11) NOT NULL auto_increment,
  `uid`	int(11) NOT NULL ,
  `family_name` varchar(32) default NULL,
  `pid`	int(11) NOT NULL ,
  `color`            varchar(128) default NULL,
  `price`            decimal(10,2) default NULL,
  `spec`             varchar(64) default NULL,
  `number` int(11) NOT NULL ,
  `url` varchar(128) default NULL,
  PRIMARY KEY  (`shopcart_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of meizu_shopcart
-- ----------------------------
INSERT INTO `meizu_shopcart` VALUES ( 1,1,'魅族 16th', '101', '远山白', '2699', '6+64G', 1,'http://127.0.0.1:3000/meizu-16th/16th-1.jpg');
INSERT INTO `meizu_shopcart` VALUES ( 2,1,'魅族 16x', '201', '汝窑白', '2099', '6+64G',2,'http://127.0.0.1:3000/meizu-16x/16x-1.jpg');


