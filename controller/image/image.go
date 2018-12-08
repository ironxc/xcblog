package image

import (
	"fmt"
	"os"
	"time"
	"strings"
	"net/http"
	"strconv"
	"github.com/xichengh/xcblog/model"
	"github.com/xichengh/xcblog/utils"
	"github.com/xichengh/xcblog/config"
	"github.com/gin-gonic/gin"
	// "github.com/globalsign/mgo"
	// "github.com/globalsign/mgo/bson"
)


func GetImage(c *gin.Context) {
	imagelist := []model.Image{}
	allimageList := []model.Image{}
	var page, perPage int
	pageQ:= c.Query("page")
	perPageQ := c.Query("perPage")
	page, _ = strconv.Atoi(pageQ)
	perPage, _ = strconv.Atoi(perPageQ)
	if( page <= 0) {
		page = 1
	}
	if( perPage <= 0) {
		perPage = 10
	}
	err := model.DB.C("images").Find(nil).Sort("-date").Skip((page - 1) * 10).Limit(perPage).All(&imagelist)
	allErr := model.DB.C("images").Find(nil).Sort("-date").All(&allimageList)
	
	if(err != nil || allErr!= nil) {
		utils.SendBadResponse(c, "服务端错误")
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"data": gin.H{
			"list":imagelist,
			"count": len(allimageList),
		},
		"msg": "success",
	})
}

func UploadImage(c *gin.Context) {
	image, err := c.FormFile("image")
	if( err != nil) {
		utils.SendBadResponse(c, "服务端错误")
		return
	}
	imageType := strings.Split(image.Header["Content-Type"][0], "/")[1]
	fmt.Println(image.Size)
	if( image.Size > 1024 * 1024 * config.BaseConf.MaxMultipartMemory) {
		utils.SendBadResponse(c, "图片太大了")
		return
	}
	imageName := utils.UniqueId() + "." + imageType
	pwd, pathErr := os.Getwd()
	if( pathErr != nil) {
		utils.SendBadResponse(c, "服务端错误")
		return
	}
	fullPath := pwd + "/images/" + imageName
	if NotExist := utils.CheckNotExist(pwd + "/images"); NotExist {
		err := utils.MkDir(pwd + "/images")
		if(err != nil) {
			utils.SendBadResponse(c, "服务端错误")
			return
		}
	}
	saveErr := c.SaveUploadedFile(image, fullPath)
	if( saveErr != nil ) {
		utils.SendBadResponse(c, "服务端错误")
		return
	}
	if err = model.DB.C("images").Insert(&model.SaveImage{
		Path: config.BaseConf.ImgPath + "/" + imageName,
		Date: time.Now(),
	}); err != nil {
		utils.SendBadResponse(c, "服务端错误")
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"data": config.BaseConf.ImgPath + "/" + imageName,
		"msg": "success",
	})
}