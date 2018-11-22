package pkg

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/xichengh/xcblog/config"
)
//错误请求
func SendBadResponse(c *gin.Context, err string) {
	c.JSON(http.StatusOK, gin.H{
		"msg": err,
	})
	// 终止请求链
	c.Abort()
}
//设置cookie
func SetCookie(c *gin.Context, name string, value string) {
	c.SetCookie(name, value, config.BaseConf.CooKieMaxAge,"/", "", false, true)
}

