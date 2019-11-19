
const path = require('path');
const fe = require('fs-extra');
const axios = require('axios');
const request = require("request");

const log4js = require('./middleware/logger')
const errlog = log4js.getLogger('err')
const infolog = log4js.getLogger('info')

/***
 * sansiled --> sansi 数据迁移
 * 
 * 
 * 
 * 
 */
class wework_api {

    constructor(access_token) {
        this.access_token = access_token;
    }
    /**
    * 获取K吧列表 GET https://lxapi.lexiangla.com/cgi-bin/v1/teams
    * @returns {Promise<void>}
    */
    async getTeams() {
        try {
            const href = `https://lxapi.lexiangla.com/cgi-bin/v1/teams`;

            const { data } = await axios.get(href, {
                headers: {
                    'Authorization': 'Bearer ' + this.access_token,
                }
            })
            infolog.info("获取K吧列表:", data)
            return data;
        } catch (e) {
            errlog.error('获取K吧列表出错：', e);
        }
    }
    /**
    * 创建K吧  POST https://lxapi.lexiangla.com/cgi-bin/v1/teams
    * @returns {Promise<void>}
    * {
        "data":{
            "type":"team",
            "attributes":{
                "name":"通过开放接口创建的K吧",
                "signature":"这是通过开放接口创建的K吧",
                "type":1,
                "is_secret": false
            },
            "relationships":{
                "orgs": {
                    "data": [
                        {
                            "type": "staff",
                            "id": "ThreeZhang"
                        },
                        {
                            "type": "department",
                            "id": 1
                        }
                    ]
                }
            }
        }
    }
    */
    async setTeams(body) {
        try {
            const href = `https://lxapi.lexiangla.com/cgi-bin/v1/teams`;

            const { data } = await axios.post(href, body, {
                headers: {
                    'Authorization': 'Bearer ' + this.access_token,
                }
            })
            infolog.info("创建K吧:", data)
            return data;
        } catch (e) {
            errlog.error('创建K吧：', e);
        }
    }

    /**
     * 获取文档列表 GET https://lxapi.lexiangla.com/cgi-bin/v1/docs
     * 获取单个文档 GET https://lxapi.lexiangla.com/cgi-bin/v1/docs/{DocID}
     * */
    async getDocs(id) {
        try {
            const href = `https://lxapi.lexiangla.com/cgi-bin/v1/docs/${id ? id : ''}`;

            const { data } = await axios.get(href, {
                headers: {
                    'Authorization': 'Bearer ' + this.access_token,
                }
            })
            infolog.info("获取文档列表:", data)
            return data;
        } catch (e) {
            errlog.error('获取文档列表:', e);
        }
    }

    /**
     * 获取帖子  GET https://lxapi.lexiangla.com/cgi-bin/v1/threads
     * 获取单条帖子 GET https://lxapi.lexiangla.com/cgi-bin/v1/threads/{ThreadID}
     * 
     */
    async getThreads(id) {
        try {
            const href = `https://lxapi.lexiangla.com/cgi-bin/v1/threads/${id ? id : ''}`;
            const { status, data } = await axios.get(href, {
                headers: {
                    'Authorization': 'Bearer ' + this.access_token,
                }
            })
            // infolog.info("获取帖子:", status, data)
            return data;
        } catch (e) {
            errlog.error('获取帖子出错：', e);
        }
    }
    /**
     * 获取回帖 Get https://lxapi.lexiangla.com/cgi-bin/v1/threads/{ThreadID}/posts
     * 
     * */
    async getThreadPosts(id) {
        try {
            const href = `https://lxapi.lexiangla.com/cgi-bin/v1/threads/${id}/posts`;
            const { status, data } = await axios.get(href, {
                headers: {
                    'Authorization': 'Bearer ' + this.access_token,
                }
            })
            infolog.info("获取回帖:", status, data)
            return data;
        } catch (e) {
            errlog.error('获取回帖出错：', e);
        }
    }
    /**
     * 创建帖子 POST https://lxapi.lexiangla.com/cgi-bin/v1/threads
     * 
     * */
    async setThread(body, staffId) {
        try {
            const href = `https://lxapi.lexiangla.com/cgi-bin/v1/threads`;

            const { status, data } = await axios.post(href, JSON.stringify(body), {
                headers: {
                    "Content-Type": "application/json;",
                    'Authorization': 'Bearer ' + this.access_token,
                    StaffID: staffId
                }
            })
            infolog.info("创建帖子:", status, data)
            return data;
        } catch (e) {
            errlog.error('创建帖子出错：', e);
        }
    }


    /**创建评论 POST https://lxapi.lexiangla.com/cgi-bin/v1/comments
     * 
     * 
     * */
    async setComments(body) {
        try {
            const href = `https://lxapi.lexiangla.com/cgi-bin/v1/comments`;
            const { status, data } = await axios.post(href, body, {
                headers: {
                    'Authorization': 'Bearer ' + this.access_token,
                    'StaffID': '008033'
                }
            })
            infolog.info("创建评论:", status, data)
            return data;
        } catch (e) {
            errlog.error('创建评论出错：', e);
        }
    }

    /**多媒体 下载 GET https://lxapi.lexiangla.com/cgi-bin/v1/assets/{asset_id}
     *  
     * */
    async getFile(id) {
        try {
            if (!id) { return 0 };
            const href = `https://lxapi.lexiangla.com/cgi-bin/v1/assets/${id}`;
            const { status, data } = await axios.get(href, {
                headers: {
                    'Authorization': 'Bearer ' + this.access_token,
                    'StaffID': '008033'
                }
            })
            infolog.info("多媒体 下载 :", status, data)
            return data;
        } catch (e) {
            errlog.error('多媒体 下载出错：', e);
        }
    }





    /** 分类 **/
    /** 获取分类列表 GET https://lxapi.lexiangla.com/cgi-bin/v1/categories
     * 
     * */
    async getCategory(type, parent_id) {
        try {
            if (type !== 'doc' || type !== 'thread') {

                const href = `https://lxapi.lexiangla.com/cgi-bin/v1/categories?target_type=${type}&${parent_id ? 'parent_id=' + parent_id : ''}`;

                const { status, data } = await axios.get(href,
                    {
                        headers: {
                            'Authorization': 'Bearer ' + this.access_token,
                        }
                    })
                // infolog.info("获取分类列表:", status, data)
                return data;
            } else {
                return -1;
            }

        } catch (e) {
            errlog.error('获取分类列表：', e);
        }
    }

    /**获取成员列表 GET https://lxapi.lexiangla.com/cgi-bin/v1/staffs
     * 
     * */
    async getStaffs() {
        try {
            const href = `https://lxapi.lexiangla.com/cgi-bin/v1/staffs?per_page=100`;

            const { status, data } = await axios.get(href,
                {
                    headers: {
                        'Authorization': 'Bearer ' + this.access_token,
                    }
                })
            console.log('获取成员列表:', data)
            return data;

        } catch (e) {
            errlog.error('获取成员列表:', e);
        }
    }
    async getAllStaffs() {
        try {
            let user = [],
                next,
                total,
                batchNum,
                result,
                href = `https://lxapi.lexiangla.com/cgi-bin/v1/staffs?per_page=100`;

            result = await axios.get(href,
                {
                    headers: {
                        'Authorization': 'Bearer ' + this.access_token,
                    }
                })
            // console.log('获取成员列表:',result.data)
            if (result.status === 200) {
                user.push(...result.data.data)

                next = result.data.links.next

                total = result.data.meta.total
                batchNum = Math.ceil(total / 100)

                if (batchNum <= 1 || !next) {
                    return;
                }
                for (let i = 1; i < batchNum; i++) {
                    if (next) {
                        result = await axios.get(next,
                            {
                                headers: {
                                    'Authorization': 'Bearer ' + this.access_token,
                                }
                            })
                        if (result.status === 200) {
                            user.push(...result.data.data)
                            next = result.data.links.next
                        }
                    }

                }
                return user;
            }

        } catch (e) {
            errlog.error('获取所有成员列表:', e);
        }
    }


}

module.exports = wework_api;
