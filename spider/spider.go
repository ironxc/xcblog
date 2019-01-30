package spider

import (
	"time"
	"github.com/gin-gonic/gin"
	"github.com/xichengh/xcblog/model"
	"github.com/globalsign/mgo/bson"
  "net/http"
  "io/ioutil"
  "regexp"
	"strings"
)
var baseUrl = "https://cn.bing.com"
func NowTimeStr() string {
	return strings.Split(time.Now().String(), " ")[0]
}
func FetchBinBgImg() string {
		var reg = regexp.MustCompile(`(?Us)"bgLink"\s*rel="preload"\s*href="(.*)"`)
		var imgPath string = ""
	  resp, _ := http.Get(baseUrl)
    body, _ := ioutil.ReadAll(resp.Body)
		defer resp.Body.Close()
		if matchResult := reg.FindAllStringSubmatch(string(body[:]), -1); matchResult != nil {
		for _, match := range matchResult {
			imgPath = baseUrl + match[1]
		}
	}
	return imgPath
}

func GetBingBg(c * gin.Context) {
	var img model.BingImage
	err := model.DB.C("bingImages").Find(bson.M{
		"date": NowTimeStr(),
	}).One(&img)
	if( err != nil){
		imgpath := FetchBinBgImg()
		c.JSON(http.StatusOK, gin.H{
			"data": imgpath,
			"msg": "success",
		})
	} else {
		c.JSON(http.StatusOK, gin.H{
			"data": img.Value,
			"msg": "success",
		})
	}
}