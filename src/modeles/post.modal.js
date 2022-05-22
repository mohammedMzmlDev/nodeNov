const DBConnection = require('../../config/db.config');
exports.add = async (val,result) => {
    let insertPostQuery = `INSERT INTO posts (title,content,user_id,sub_heading) VALUES ('${val.body.title}','${val.body.content}',${val.body.user_id},'${val.body.sub_heading}')`;
    let checkDuplicates = `SELECT COUNT(*) AS title FROM posts WHERE title = '${val.body.title}'`;
    await executeQuery(checkDuplicates).then(async (res) => {
        if(res[0]["title"]){
            result({
                status : 1062,
                message : 'Post with this title already exist'
            })
        }else{
            await executeQuery(insertPostQuery).then((response) => {
                if(response.insertId){
                    result({
                        status : 200,
                        message : 'Post successfully created'
                    })
                }
            }).catch((error) => {
                result({
                    status:400,
                    message : error
                })
            })
        }
    }).catch((err) => {
        result({
            status:400,
            message : err
        })
    });
}

exports.getUserPosts = async (userID,result) => {
    // console.log(userID.body.user_id);
    /* 
    Left join
    SELECT * from posts as p LEFT JOIN users as u on u.UserID = p.user_id
    Inner join
    SELECT * from posts as p INNER JOIN users as u on u.UserID = p.user_id
    Simple query
    SELECT * from posts WHERE user_id = 1
    */
   console.log('uID',userID.query);
   await executeQuery(`SELECT * from posts WHERE user_id = ${userID.query.user_id}`).then((res) => {
       console.log('res of posts',res);
       if(res){
           result({
               status:200,
               message : res
           });
       }
   }).catch((err) => {
       result({
           status : 400,
           message : err
       })
   })
}

exports.getAllPosts = async (result) => {
    await executeQuery(`SELECT u.FirstName,u.LastName,u.Email,u.ProfilePic, p.id , p.title, p.content, p.user_id from posts as p left JOIN users as u on p.user_id = u.UserID`).then((res) => {
        if(res){
            result({
                status:200,
                data : res
            })
        }
    }).catch(err => {
        result({
            status : 400,
            message : err
        })
    })
}

exports.deletePost = async (request,result) => {
    await executeQuery(`DELETE FROM posts WHERE id =${request.body.id}`).then((res) => {
        if(res.fieldCount){
            result({
                status:200,
                message : 'Post Deleted'
            });
        }else {
            result({
                status:400,
                message : 'Post Not Deleted'
            });
        }
    }).catch((err) => {
        result({
            status : 500,
            message : err
        })
    })
}

// to update
/* 
UPDATE posts SET title = '==', content='------------', sub_heading='sb', updated_at = CURRENT_TIMESTAMP WHERE id = 10
*/

exports.updatePost = async (request,response) => {
    await executeQuery(`UPDATE posts SET title = '${request.body.title}', content='${request.body.content}', sub_heading='${request.body.sub_heading}', updated_at = CURRENT_TIMESTAMP WHERE id = ${request.body.id}`).then((res) => {
        if(res.affectedRows){
            response({
                status : 200,
                message : 'Post updated successfully'
            })
        } else {
            response({
                status : 400,
                message : 'Failed to updated Post'
            })
        }
    }).catch((err) => {
        response({
            status : 500,
            message : 'Failed to updated Post'
        })
    })
}

function executeQuery(query) {
    return new Promise((resolve,reject) => {
        if(query){
            DBConnection.query(query,async (err,res) => {
                if(err){
                    reject(err)
                }
                resolve(res)
            })
        }else{
            reject('Invalid Query')
        }
    })
}