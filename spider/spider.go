package spider

import (
	"time"
	"github.com/gin-gonic/gin"
	"github.com/xichengh/xcblog/model"
	"github.com/globalsign/mgo/bson"
	// "fmt"
  "net/http"
  "io/ioutil"
  "regexp"
  "strings"
)

func NowTimeStr() string {
	return strings.Split(time.Now().String(), " ")[0]
}
func FetchBinBgImg() string {
		var imgPath string
		var err error
    url := "https://www.bing.com"
    exp1 := regexp.MustCompile(`<img[^>]+\bsrc=["']([^"']+)["']`)
	  resp, _ := http.Get(url)
    body, _ := ioutil.ReadAll(resp.Body)
    defer resp.Body.Close()
    allImgTags := exp1.FindAllString(string(body), -1)
    if(len(allImgTags) > 0) {
      imgPath = url + strings.Split(allImgTags[len(allImgTags) - 1: len(allImgTags)][0], "\"")[1]
    }
    if(imgPath != "") {
			err = model.DB.C("bingImages").Insert(&model.BingImage {
				Date: NowTimeStr(),
				Value: imgPath,
			})
		}
		if(err != nil){
			return ""
		} else {
			return imgPath
		}
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