
const pool=require("../pool");
const sqlstring = require('sqlstring');     //sql占位符模块

const wx_access_token = require('./wx_access_token');
const moment = require('moment');

const log4js = require('./middleware/logger')
const errlog = log4js.getLogger('err')
const infolog = log4js.getLogger('info')


class wx_subscription {
    constructor(appID, appSecret) {
        this.wx_access_token = new wx_access_token(appID, appSecret);
      
    }
    /**
     * 同步最新文章到数据库中
     */
    async syncLatestArticle() {
        try {
            //获取最新的前20篇图文文章
            let result = await this.wx_access_token.getBatchGetMaterial('news', 0, 20);
            infolog.info('获取最新的前20篇图文文章 result:',result);
            let {item} = result;
            
            await this.parseNewsItems(item);
        } catch (e) {
            errlog.error('syncLatestArticle error:', e);
        }
    }


    // 数据处理 写入数据库
    async parseNewsItems(arrItems) {
        for (let i = 0; i < arrItems.length; i++) {
            const item = arrItems[i];
            //创建日期
            let create_time = parseInt(item.content.create_time) * 1000;
            //更新日期
            let update_time = parseInt(item.content.update_time) * 1000;
            for (let j = 0; j < item.content.news_item.length; j++) {
                //获取图文消息
                const {title,thumb_media_id,show_cover_pic,author,digest,content,url,content_source_url,thumb_url} = item.content.news_item[j];
                //过滤未发布的文章,没有封面表示没有发布
                if (thumb_url === '' || thumb_url === null || thumb_url.trim().length === 0) continue;
                //格式化时间
                create_time = moment(create_time).format('YYYY-MM-DD HH:mm:ss');
                update_time = moment(update_time).format('YYYY-MM-DD HH:mm:ss');
                const article = {
                    title,
                    thumb_media_id,
                    show_cover_pic,
                    author,
                    digest,
                    content,
                    url,
                    content_source_url,
                    thumb_url,
                    create_time,
                    update_time
                };
                //将文章同步到数据库中
                const result = await this.saveArticle(article);
            }
        }
    }

    async saveArticle(article) {
        try {
            const {thumb_media_id} = article;
            const isExits = await this.isExitsArticle(thumb_media_id);
            let keys = Object.keys(article),
                vals = Object.values(article)
                sign,
                sql;
            
            if(isExits) {   //数据库中已存在 UPDATE
                let index = keys.indexOf('thumb_media_id');
                keys.splice(index,1);
                vals.splice(index,1);
                
                sign = keys.map(key => `${key}=?`).join(',');
                vals.push(thumb_media_id);

                sql = sqlstring.format(`UPDATE article_list SET ${sign} WHERE thumb_media_id = ?`,vals);
                pool.query(sql,(error,result) => {
                    if(error){
                        errlog.error('pool.query('+sql+')',error)
                    }
                    return result;
                });
            } else {        //数据库中不存在 INSERT
                sign = new Array(keys.length).fill('?').join(',')
                sql = sqlstring.format(`INSERT INTO article_list(${keys.join(',')}) VALUES(${sign})`,vals);
                
                pool.query(sql,(error,result) => {
                    if(error){
                        errlog.error('pool.query('+sql+')',error)
                    }
                    return result;
                });
            }
        } catch (e) {
            errlog.error('saveArticle出错:',e)
        }
    }

    /**
     * 根据 thumb_media_id 查询数据库中是否存在文章
     * @param thumb_media_id
     * @returns {Promise<void>} 
     */
    isExitsArticle(thumb_media_id) {
        const sql = sqlstring.format(`SELECT blog_id FROM article_list WHERE thumb_media_id = ?`,[thumb_media_id]);
        let res =  new Promise( resolve => {
            pool.query(sql,(error,result) => {
                if(error){
                    errlog.error('pool.query('+sql+')',error)
                }
                resolve(result && result.length > 0);
            });
        }).then( data =>{
            return data;
        }).catch(err =>{
            errlog.error('isExitsArticle Promise-err::',err);
        });
        return res;

    }

}

module.exports = wx_subscription;