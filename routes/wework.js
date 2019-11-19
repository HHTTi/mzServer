var express = require("express");
var router = express.Router();

const log4js = require('../src/middleware/logger')
const errlog = log4js.getLogger('err')
const infolog = log4js.getLogger('info')

const wework_access_token = require('../src/wework_access_token')
const wework_api = require('../src/wework_api')
const sansiled_to_sansi = require('../src/compoments/sansiled_to_sansi')
const config = {
    //
    sansi: {
        appKey: 'c4c90c3095a511e9b61a5254002f1020',
        appSecret: 'bsoVHjlVE9EesSu5NySizkWkFRyjviJP0nDAkzw0'
    },
    sansiled: {
        appKey: '8d0543aad6c311e8899e52540005f435',
        appSecret: 'KQdV1GihMrdQVPEbqrRKjwW8x3epJLqBDWOScVsu'
    },
    token: '2333'
}


/** 
 * 获取K吧列表
 * 
 * */
router.get("/get_teams", async (req, res) => {
    let { token, company } = req.query,
        code = 0;
    infolog.info('wework get_teams:', req.query);
    try {
        if (token && company && token === config.token && (company === 'sansi' || company === 'sansiled')) {
            let access_token = await new wework_access_token(config[company].appKey, config[company].appSecret).getAccessToken()
            let { data } = await new wework_api(access_token).getTeams();
            if (data) {
                code = 1;
            }
            infolog.info("wework get_teams: res", code)
            res.send({ code, data })
        } else {
            res.send({ code })
            return;
        }
    } catch (e) {
        errlog.error('wework get_teams:', e)
    }
})


/**
 * 获取文档
 * 
 * */
router.get("/get_docs", async (req, res) => {
    let { token, company, id } = req.query,
        code = 0;
    infolog.info('wework get_docs:', req.query);
    try {
        if (token && company && token === config.token && (company === 'sansi' || company === 'sansiled')) {
            let access_token = await new wework_access_token(config[company].appKey, config[company].appSecret).getAccessToken()
            let { data } = await new wework_api(access_token).getDocs(id);
            if (data) {
                code = 1;
            }
            infolog.info("wework get_docs: res", code)
            res.send({ code, data })
        } else {
            res.send({ code })
            return;
        }
    } catch (e) {
        errlog.error('wework get_docs:', e)
    }
})
/**
 * 获取帖子列表 getThreads
 * 
 * */
router.get("/get_threads", async (req, res) => {
    let { token, company, id } = req.query,
        code = 0;
    infolog.info('wework get_threads:', req.query);
    try {
        if (token && company && token === config.token && (company === 'sansi' || company === 'sansiled')) {
            let access_token = await new wework_access_token(config[company].appKey, config[company].appSecret).getAccessToken()
            let { data } = await new wework_api(access_token).getThreads(id);
            if (data) {
                code = 1;
            }
            infolog.info("wework get_threads: res", code)
            res.send({ code, data })
        } else {
            res.send({ code: -1 })
            return;
        }
    } catch (e) {
        errlog.error('wework get_threads:', e)
    }
})

/**
 * 获取回帖 
 * 
 * */
router.get("/get_thread_post", async (req, res) => {
    let { token, company, id } = req.query,
        code = 0;
    infolog.info('wework get_threads:', req.query);
    try {
        if (token && company && id && token === config.token && (company === 'sansi' || company === 'sansiled')) {
            let access_token = await new wework_access_token(config[company].appKey, config[company].appSecret).getAccessToken()
            let { data } = await new wework_api(access_token).getThreadPosts(id);
            if (data) {
                code = 1;
            }
            infolog.info("wework get_thread_post: res", code)
            res.send({ code, data })
        } else {
            res.send({ code })
            return;
        }
    } catch (e) {
        errlog.error('wework get_thread_post:', e)
    }
})

/**
 * 创建帖子 test
 * 
 * 
 * */
router.get("/set_thread", async (req, res) => {
    let { token, company, id } = req.query,
        code = 0;
    infolog.info('wework set_thread:', req.query);
    try {
        if (token && token === config.token) {
            let access_token = await new wework_access_token(config.sansi.appKey, config.sansi.appSecret).getAccessToken()
            let data = {
                type: "thread",
                attributes: {
                    title: "Commit Brooklyn 2019 : GitLab\'s Journey to Continuous Delivery",
                    content: `<p>不要慌张，GitLab 也是直到 2019 年才把 depl
            oy 从半自动改进到全自动的。</p >\\n<p> </p >\\n < p > <img id=\\"swan-video-5285890794215622329\\" class=\\"swan-video-container\\" src =\\"https://lexiangla.com/build/img/video-pl
            aceholder.png\\" alt=\\"video - placeholder.png\\" /><br /><br /></p>\\n < p > This talk is about the practical realities of starting continuous deployments for legacy applications.GitLab releases every 22nd of the month to help their large, self - managed install base maintain consistency.However, as they are in the process of moving to Kubernetes, they are increasing the velocity of feature development(yay!) and that meant they needed the ability to deploy more regularly.Traditionally, talks and blog posts focus on adopting the latest Kubernetes - enabled, star - spangled CI / CD solution but Marin went the alternate route of pushing GitLab\'s existing legacy CI/CD system to the limit instead. This talk is the story of how Marin Jankovski found success, both human and byte-sized.</p>\\n<p>Learn from an Engineering Manager at GitLab, as Marin jumps into not only why this migration is important but how to make it as effective and seamless as possible.</p>\\n<p>Speaker: Marin Jankovski, Engineering Manager at GitLab</p>`
                },
                relationships: {
                    category: {
                        data: {
                            type: "category",

                        }
                    }
                }
            }

            let r = await new wework_api(access_token).setThread(data)

            infolog.info("wework set_thread: res", r)

            res.send({ code, res: r })
        } else {
            res.send({ code })
            return;
        }
    } catch (e) {
        errlog.error('wework set_thread:', e)
    }
})


/**创建评论 POST https://lxapi.lexiangla.com/cgi-bin/v1/comments
 * 
 * 
 * */
router.get("/set_comments", async (req, res) => {
    let { token, company, id } = req.query,
        code = 0;
    infolog.info('wework set_comments:', req.query);
    try {
        if (token && company && id && token === config.token && (company === 'sansi' || company === 'sansiled')) {
            let access_token = await new wework_access_token(config[company].appKey, config[company].appSecret).getAccessToken()
            let body = {
                type: "comment",
                attributes: {
                    content: "测试 添加sansiled 评论接口"
                },
                relationships: {
                    target: {
                        data: {
                            type: "doc",
                            id
                        }
                    }
                }
            }
            let { data } = await new wework_api(access_token).setComments(body);
            if (data) {
                code = 1;
            }
            infolog.info("wework set_comments: res", code)
            res.send({ code, data })
        } else {
            res.send({ code })
            return;
        }
    } catch (e) {
        errlog.error('wework set_comments:', e)
    }
})

/**getFile 文件下载
 * 
 * */
router.get("/get_file", async (req, res) => {
    let { token, company, id } = req.query,
        code = 0;
    infolog.info('wework get_file:', req.query);
    try {
        if (token && company && id && token === config.token && (company === 'sansi' || company === 'sansiled')) {
            let access_token = await new wework_access_token(config[company].appKey, config[company].appSecret).getAccessToken()
            let { data } = await new wework_api(access_token).getFile(id);
            if (data) {
                code = 1;
            }
            infolog.info("wework getFile: res", code)
            res.send({ code, data })
        } else {
            res.send({ code })
            return;
        }
    } catch (e) {
        errlog.error('wework get_file:', e)
    }
})

// 获取分类 getCategory
router.get("/get_category", async (req, res) => {
    let { token, company, type, parent_id } = req.query,
        code = 0;
    infolog.info('wework get_category:', req.query);
    try {
        if (type && token === config.token && (company === 'sansi' || company === 'sansiled')) {
            let key = config[company].appKey,
                secret = config[company].appSecret,
                access_token = await new wework_access_token(key, secret).getAccessToken(),
                { data } = await new wework_api(access_token).getCategory(type, parent_id);
            if (data) {
                code = 1;
            }
            infolog.info("wework get_category: res", code, data)
            res.send({ code, data })
        } else {
            res.send({ code })
            return;
        }
    } catch (e) {
        errlog.error('wework get_category:', e)
    }
})

/**获取成员列表 GET https://lxapi.lexiangla.com/cgi-bin/v1/staffs
 * 
 * */
router.get("/get_staffs", async (req, res) => {
    let { token, company} = req.query,
        code = 0;
    infolog.info('wework get_staffs:', req.query);
    try {
        if ( token === config.token && (company === 'sansi' || company === 'sansiled')) {
            let key = config[company].appKey,
                secret = config[company].appSecret,
                access_token = await new wework_access_token(key, secret).getAccessToken(),
                data = await new wework_api(access_token).getAllStaffs();
            if (data) {
                code = 1;
            }
            // infolog.info("wework get_staffs: res", data)
            res.send({ code, data })
        } else {
            res.send({ code })
            return;
        }
    } catch (e) {
        errlog.error('wework get_staffs:', e)
    }
})

/***
 * 数据迁移
 * 1. 获取帖子总数 拿到帖子id
 * 2. 遍历  获取单条帖子内容
 * 3.       创建新贴与回帖
 * 
 */
router.get('/get_threads_sansiled_to_sansi', async (req, res) => {
    let { token } = req.query,
        code = 0;
    infolog.info('wework get_threads_sansiled_to_sansi:query', req.query);

    try {
        if (token && token === config.token) {
            let sansiled_token = await new wework_access_token(config.sansiled.appKey, config.sansiled.appSecret).getAccessToken(),
                sansi_token = await new wework_access_token(config.sansi.appKey, config.sansi.appSecret).getAccessToken(),

                sansiled2sansi = await new sansiled_to_sansi(sansiled_token, sansi_token).threads()


            code = 1;
            res.send({ code, sansiled2sansi })
        } else {
            res.send({ code })
            return;
        }

    } catch (e) {
        errlog.error('wework get_thread_post:', e)
    }
})


// 


module.exports = router;