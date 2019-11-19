
const path = require('path');
const fe = require('fs-extra');
const axios = require('axios');

const log4js = require('./middleware/logger')
const errlog = log4js.getLogger('err')
const infolog = log4js.getLogger('info')

const wework_access_token = require('../../src/wework_access_token')
const wework_api = require('../../src/wework_api')


/***
 * sansiled --> sansi 
 * 
 * 数据迁移
 * 
 */

class sansiled_to_sansi {
    constructor(sansiled_token, sansi_token) {

        this.sansiled_wework_api = new wework_api(sansiled_token)
        this.sansi_wework_api = new wework_api(sansi_token)
    }

    /** 
    * 1. 获取帖子总数 拿到帖子id
    * 2. 遍历  获取单条帖子内容
    * 3.       创建新贴与回帖
    */
    async threads() {
        // 1
        let { data } = await this.sansiled_wework_api.getThreads();

        console.log('list', data)
        // 2
        for (let i = 0; i < data.length; i++) {

            let item_thread = await sansiled_wework_api.getThreads(data[i].id);

            let { attributes, relationships } = item_thread.data,
                { title, content } = attributes,
                { category, owner } = relationships,
                staffId = owner.data.id,
                categoryId = category.data.id

            let new_thread = {
                data: {
                    type: 'thread',
                    attributes: {
                        title,
                        content
                    },
                    relationships: {
                        category: {
                            data: {
                                type: "category",
                                id: categoryId
                            }
                        }

                    }
                }
            }
            console.log('new_thread', new_thread)

            // 3

            let result = await sansi_wework_api.setThread(new_thread, staffId)

            console.log('id------', item_thread, 'setThread::', result)
        }
    }

    }

module.exports = sansiled_to_sansi;