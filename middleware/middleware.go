package middleware

import (
	// "fmt"
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/xichengh/xcblog/pkg"
	"github.com/xichengh/xcblog/config"
	"github.com/globalsign/mgo/bson"
	"time"
	jwt "github.com/dgrijalva/jwt-go"
	"github.com/xichengh/xcblog/model"
)
type CustomClaims struct {
		UserName  string         `json:"username"`
		ID        bson.ObjectId `json:"id" bson:"_id"`
    jwt.StandardClaims
}
//创建jwttoken
func CreateJwtToken(c *gin.Context, ID bson.ObjectId, UserName string) {
	// Create the Claims
	claims := CustomClaims{
		UserName,
		ID,
		jwt.StandardClaims {
				ExpiresAt: time.Now().Add(time.Duration(1)*time.Hour).Unix(),
				IssuedAt:  time.Now().Unix(),
				Issuer:    "xc",
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(config.BaseConf.TokenSecret))
	if(err != nil) {
		pkg.SendBadResponse(c, "服务端错")
		return
	}
	pkg.SetCookie(c, "xtoken", tokenString)
}
//解析jwt
func ParseJwtToken(tokenString string) (bson.ObjectId, string, bool) {
	token, err := jwt.ParseWithClaims(tokenString, &CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
        return []byte(config.BaseConf.TokenSecret), nil
		})
		claims, ok := token.Claims.(*CustomClaims);
		return claims.ID, claims.UserName, ok && token.Valid && err == nil
}

// 需要登录
func SigninRequired(c *gin.Context) {
	token, err := c.Cookie("xtoken")
	if( err != nil) {
		pkg.SendBadResponse(c, "未登录")
		return
	}

	ID, UserName, valid := ParseJwtToken(token)
	user := model.Author{ UserName:UserName, ID:ID}
	if !valid {
		pkg.SendBadResponse(c, "未登录")
		return
	}
	c.Set("user", user)
	c.Next()
}

//刷新token
func RefreshToken(c *gin.Context) {
	token, err := c.Cookie("xtoken")
	if( err == nil) {
		pkg.SetCookie(c, "xtoken", token)
	}
	c.Next()
}

func ErrorHandler() gin.HandlerFunc {
	return func (c *gin.Context) {
		errmsg, _ := c.Get("errmsg")
		c.JSON(http.StatusOK, gin.H{
			"msg": errmsg,
		})
		// 终止请求链
		c.Abort()
		return
	}
}