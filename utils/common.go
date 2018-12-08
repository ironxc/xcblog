package utils

import (
	"net/http"
	"github.com/gin-gonic/gin"
)
//错误请求
func SendBadResponse(c *gin.Context, err string) {
	c.JSON(http.StatusOK, gin.H{
		"msg": err,
	})
	// 终止请求链
	c.Abort()
}


