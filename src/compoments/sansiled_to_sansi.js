
const path = require('path');
const fe = require('fs-extra');
const axios = require('axios');

const request = require('request')
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
    *                   (正则匹配content内图片地址，拿到图片保存在本地，上传到新账户，替换图片地址)
    * 
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
        for (let i = 0; i < data.length; i++) {
            // for (let i = 0; i < 1; i++) {

            let item_thread = await this.sansiled_wework_api.getThreads(data[i].id);
            console.log('2. 遍历  获取sansiled单条帖子内容', i)

            let { id, attributes, relationships } = item_thread.data,
                { title, content } = attributes,
                { category, owner } = relationships,
                staffId = owner.data.id,
                categoryId = category.data.id,
                newContent;
            let oldStaff = sansiled_user.find(ele => ele.id == staffId),
                newStaff = sansi_user.find(ele => ele.attributes.name == oldStaff.attributes.name)
            // 替换图片
            let r = /https:\/\/lexiangla.com\/assets[^"]*/ig,
                srcArr = content.match(r);
            // console.log('srcArr---', srcArr)
            if (srcArr && srcArr.length > 0) {

                for (let imgUrl of srcArr) {
                    let arr = imgUrl.split('/'),
                        getAssetRes = await this.sansiled_wework_api.getAsset(arr[arr.length - 1])
                    console.log(imgUrl, 'getAssetRes', getAssetRes);
                    if (getAssetRes && getAssetRes.url) {
                        // 拿到图片保存在本地
                        let dowImgRes = await this.downloadImg(getAssetRes.url, arr[arr.length - 1])
                        console.log('downloadImg', dowImgRes)
                        if (dowImgRes.code) {
                            //  TODO: 上传图片
                            // let setAssetRes = await this.sansi_wework_api.setAsset(dowImgRes.path, newStaff.id)
                            // console.log('setAssetRes',setAssetRes)
                            // if(setAssetRes && setAssetRes.url) {
                            //     let nr = new RegExp(imgUrl,'g')
                            //     newContent = content.replace(nr,setAssetRes.url)
                            //     console.log('newContent',newContent)
                            // }

                        } else {
                            errlog.error('图片保存在本地:', dowImgRes)
                        }

                        // request(getAssetRes.url).pipe(fe.createWriteStream('../../uploadFiles' + arr[arr.length-1]));

                    }
                }

            }



            continue;
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

                }


            console.log(new_thread, 'new_thread');
            // let newThread = await this.sansi_wework_api.setThread(new_thread, newStaff.id)

            console.log('id-newThread-----', newThread)
            let newThreadId = newThread.data.id

            // 6
            let posts = await this.sansiled_wework_api.getThreadPosts(id);
            let list = posts.data.sort((a, b) => a.attributes.floor - b.attributes.floor);
            console.log('posts', list)

            for (let i = 0; i < list.length; i++) {
                let content = list[i].attributes.content,
                    postStaffId = list[i].relationships.owner.data.id,
                    oldStaff = sansiled_user.find(ele => ele.id == postStaffId),
                    newStaff = sansi_user.find(ele => ele.attributes.name == oldStaff.attributes.name),
                    newPost = {
                        "type": "post",
                        "attributes": {
                            "content": content
                        }
                    }
                // let postRes = await this.sansi_wework_api.setPost(newStaff.id, newThreadId, newPost)
                console.log('postRes---', postRes, 'newStaff,id,newPost---', newStaff, newThreadId, newPost)
            }



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
    // 下载图片
    async downloadImg(url, name) {
        let dstpath = path.resolve(__dirname, '../../uploadFiles/wework/'),
            imgPath = dstpath + '/' + name + '.jpg'
        if (!fe.existsSync(dstpath)) {
            fe.mkdirSync(dstpath);
        }
        // console.log('dstpath', dstpath)

        return new Promise((resolve, reject) => {
            if (!fe.existsSync(imgPath)) {

                const wstream = request(url).pipe(fe.createWriteStream(imgPath))
                wstream.on('finish', () => { resolve({ code: 1, path: imgPath}) });
                wstream.on('error', (err) => { reject({ code: 0, err }) });
            }else {
                resolve({code:-1})
            }
        })
    }

}

module.exports = sansiled_to_sansi;