
const path = require('path');
const fe = require('fs-extra');
const axios = require('axios');

const log4js = require('../middleware/logger')
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
    * 1. 获取sansiled帖子总数 拿到帖子id
    * 2. 遍历  获取sansiled单条帖子内容
    * 3.       根据sansiled帖子分类id  查找所属分类
    * 4.               根据分类 查找sansi新贴分类id
    * 5.                    生成新贴数据 创建新贴
    * 6.        获取当前帖子所有回帖
    * 7.        遍历    根据回帖id   查找所属用户
    * 8.                    根据用户名 查找所属sansi ID
    * 9.                        生成新回帖数据
    * 10.           生成回帖 创建回帖
    */
    async threads() {
        // 用户列表 arr
        const { sansi_user, sansiled_user } = await this.getAllStaffs()

        // 帖子类列表 arr
        const { sansiled_category, sansi_category } = await this.getCategories()

        // console.log('帖子类列表', sansiled_category, sansi_category)
        // 1
        let { data } = await this.sansiled_wework_api.getThreads();

        console.log('1. 获取sansiled帖子总数 拿到帖子id', data.length)
        // 2
        // return;
        // for (let i = 0; i < data.length; i++) {
        for (let i = 0; i < 1; i++) {

            let item_thread = await this.sansiled_wework_api.getThreads(data[i].id);
            console.log('2. 遍历  获取sansiled单条帖子内容')

            let { id, attributes, relationships } = item_thread.data,
                { title, content } = attributes,
                { category, owner } = relationships,
                staffId = owner.data.id,
                categoryId = category.data.id;
            // 3
            let oldCategory = sansiled_category.find(ele => ele.id == categoryId),
                // 4
                newCategory = sansi_category.find(ele => ele.attributes.name == oldCategory.attributes.name),
                // 5
                new_thread =
                {
                    "type": "thread",
                    "attributes": {
                        "title": title,
                        "content": content
                    },
                    "relationships": {
                        "category": {
                            "data": {
                                "type": "category",
                                "id": newCategory.id
                            }
                        }
                    }

                },
                oldStaff = sansiled_user.find(ele => ele.id == staffId),
                newStaff = sansi_user.find(ele => ele.attributes.name == oldStaff.attributes.name)

            console.log(new_thread, 'new_thread');
            let newThread = await this.sansi_wework_api.setThread(new_thread, newStaff.id)

            console.log('id-newThread-----', newThread)


            // 6
            let posts = await this.sansiled_wework_api.getThreadPosts(id);
            console.log('posts',posts)
        }
    }
    //  分类列表
    async getCategories() {
        let sansi, sansiled, sansiled_category, sansi_category;

        sansiled = await this.sansiled_wework_api.getCategory('thread');

        sansi = await this.sansi_wework_api.getCategory('thread');


        sansiled_category = sansiled.data

        sansi_category = sansi.data

        return {
            sansiled_category,
            sansi_category
        }
    }
    // 用户列表
    async getAllStaffs() {
        let sansi_user, sansiled_user;

        sansiled_user = await this.sansiled_wework_api.getAllStaffs();

        sansi_user = await this.sansi_wework_api.getAllStaffs();

        return {
            sansi_user,
            sansiled_user
        }
    }

}

module.exports = sansiled_to_sansi;