const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

exports.main = async ( event ) => {
  const { userinfo } = event 
  const wxContext = cloud.getWXContext()
  // return {
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }

  console.log('userinfo:::', userinfo)
  try {
    const { data } = await db
    .collection( 'userinfo' )
    .where({
      openid: wxContext.OPENID
    })
    .get()
    
    let _id 
    if( data.length > 0 ){
      return {
        user: data[0]
      }
    } else {
      const _data = await db.collection('userinfo').add({
        data: {
          ...userinfo,
          openid: wxContext.OPENID,
          createdAt: db.serverDate(),
          updatedAt: db.serverDate(),
        }
      })
      
      _id = _data._id

    }

    const user = await db.collection('userinfo').doc(_id)

    return {
      user,
    }
  } catch ( err ){
    console.error( `Login Err: ${err}`)
  }

}