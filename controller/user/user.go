package user

import (
	"github.com/xichengh/xcblog/utils"
	// "fmt"
	"net/http"
	"time"
	"github.com/gin-gonic/gin"
	"github.com/globalsign/mgo/bson"
	"github.com/xichengh/xcblog/model"
	mw "github.com/xichengh/xcblog/middleware"
)

type SignInPostData struct {
	UserName string `json:"username"`
	PassWord string `json:"password"`
}
type SignUpPostData struct {
	Email     string        `json:"email"`
	UserName  string        `json:"username"`
	PassWord  string        `json:"password"`
}
type UserRes struct {
	ID        bson.ObjectId `json:"id" bson:"_id"`
	Name      string        `json:"name"`
	Email     string        `json:"email"`
	Signature string        `json:"signature"`
	Avatar    string        `json:"avatar"`
	UserName  string        `json:"username"`
	CreatedAt int64         `json:"createdAt"`
	UpdatedAt int64         `json:"updatedAt"`
}




func SaveUser(data SignUpPostData) (UserRes,error){
	UserData := model.User{
		ID:bson.NewObjectId(),
		CreatedAt:time.Now(),
		UpdatedAt:time.Now(),
		Name:data.UserName,
		Email:data.Email,
		Signature: "这个人啥也没留",
		Avatar: "",
		UserName:data.UserName,
		PassWord:utils.EncodeMD5(data.PassWord),
	}
	err := model.DB.C("users").Insert(&UserData)
	ResData := UserRes{
		ID:              UserData.ID,
		Name:            UserData.Name,
		Email:           UserData.Email,
		Signature:       UserData.Signature,
		Avatar:          UserData.Avatar,
		UserName:        UserData.UserName,
		CreatedAt:       UserData.CreatedAt.Unix(),
		UpdatedAt:       UserData.UpdatedAt.Unix(),
	}
	return ResData, err
}
func SignIn(c *gin.Context) {
	var postData SignInPostData
	var result model.User
	if err := c.BindJSON(&postData); err != nil {
		utils.SendBadResponse(c, "服务端错误")
		return
	}
	if findErr := model.DB.C("users").Find(bson.M{
		"username": postData.UserName,
		"password": utils.EncodeMD5(postData.PassWord),
	}).One(&result); findErr != nil {
		utils.SendBadResponse(c, "账号或密码错误")
		return
	}
	userData := UserRes{
		ID:              result.ID,
		Name:            result.Name,
		Email:           result.Email,
		Signature:       result.Signature,
		Avatar:          result.Avatar,
		UserName:        result.UserName,
		CreatedAt:       result.CreatedAt.Unix(),
		UpdatedAt:       result.UpdatedAt.Unix(),
	}
	mw.CreateJwtToken(c, result.ID, result.UserName)
	c.JSON(http.StatusOK, gin.H{
		"msg": "success",
		"data": userData,
	})
}
func SignUp(c *gin.Context) {
	var postData SignUpPostData
	var result UserRes
	if err := c.BindJSON(&postData); err != nil {
		utils.SendBadResponse(c, "服务端错误")
		return
	}
	if findErr := model.DB.C("users").Find(bson.M{
		"username": postData.UserName,
	}).One(&result); findErr == nil {
		utils.SendBadResponse(c, "用户名已存在")
		return
	}
	UserData, saveErr := SaveUser(postData)
	mw.CreateJwtToken(c, UserData.ID, UserData.UserName)

	if saveErr != nil {
		utils.SendBadResponse(c, "服务端错误")
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"msg": "success",
		"data": UserData,
	})
}
func Userinfo(c *gin.Context) {
	var result UserRes
	user, exit := c.Get("user")
	if !exit {
		utils.SendBadResponse(c, "未登录")
		return
	}
	if findErr := model.DB.C("users").Find(bson.M{
		"_id": user.(model.Author).ID,
	}).One(&result); findErr != nil {
		utils.SendBadResponse(c, "未登录")
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"msg": "success",
		"data": result,
	})
}
