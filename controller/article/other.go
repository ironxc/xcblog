package article

import (
	// "fmt"
	"net/http"
	"github.com/xichengh/xcblog/model"
	"github.com/xichengh/xcblog/utils"
	"github.com/gin-gonic/gin"
	"github.com/globalsign/mgo"
	"github.com/globalsign/mgo/bson"
)

type Tag struct{
	Value string  `json:"value" bson:"_id"`
	Num   int     `json:"num" bson:"value"`
}
func GetTags(c *gin.Context) {
	var resTags []Tag
	job := &mgo.MapReduce{
		Map:"function(){ this.tags.forEach(function(z){ emit(z,1); })}",
		Reduce:   "function (k, values) { var total=0;for(var i=0;i<values.length;i++){ total += values[i]; } return total;}",
	}
	_, err := model.DB.C("articles").Find(bson.M{
		"status": 1,
	}).MapReduce(job, &resTags)

	if( err != nil) {
		utils.SendBadResponse(c, "服务端错误")
		return
	} else {
			c.JSON(http.StatusOK, gin.H{
			"data":resTags,
			"msg": "success",
		})
	}
}