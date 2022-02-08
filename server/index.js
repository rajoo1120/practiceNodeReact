const express = require('express')
const app = express()
const port = 5000

const config = require('./config/key');

const { auth } = require('./middleware/auth')
const { User } = require("./models/User")
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}))
//application/json
app.use(bodyParser.json())
app.use(cookieParser())

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI).then(()=>console.log('MongoDB Connected...'))
.catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World! 안녕')
})

app.post('/api/users/register',(req,res)=>{
  //회원가입에 필요한 정보들을 client에서 가져오면
  //그것을 DB에 넣어줌 
  const user = new User(req.body)

  user.save((err, userInfo) => {
    if(err) return res.json({success: false, err})
    return res.status(200).json({
      success : true
    })
  })
})

app.post('/api/users/login', (req, res)=> {
  //요청된 이메일을 데베에서 찾음 
  User.findOne({ email: req.body.email }, (err, user)=> {
    if(!user){
      return res.json({
        loginSuccess: false,
        message: "이메일에 해당하는 유저가 없습니다."
      })
    }
    //데베에 있으면 비번이 맞는비번인지 확인 
    user.comparePassword(req.body.password, (err, isMatch)=> {
      if(!isMatch)
      return res.json({loginSuccess: false, 
      message: "비밀번호가 틀렸습니다."})

      //비번도 맞으면 토큰 생성
      user.generateToken((err,user)=>{
        if(err) return res.status(400).send(err);

        //토큰 저장, 쿠키
        res.cookie("x_auth", user.token)
        .status(200)
        .json({loginSuccess : true, userId : user._id})

      })
    })


  })
})

//role 0 -> 일반 유저, role이 0이 아니면 -> 관리자
app.get('/api/users/auth',auth ,(req,res)=>{
  //인증 완료 된거 

  res.status(200).json({
    _id : req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true, 
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})

app.get('/api/users/logout', auth, (req,res)=> {
  User.findOneAndUpdate({_id: req.user._id}, {token: "" }
  , (err,user)=>{
    if(err) return res.json({success: false, err})
    return res.status(200).send({
      success: true
    })
  })
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})