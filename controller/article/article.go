package article

import (
	// "fmt"
	"strconv"
	"net/http"
	"github.com/xichengh/xcblog/model"
	"github.com/xichengh/xcblog/pkg"
	"time"
	"github.com/gin-gonic/gin"
	"github.com/globalsign/mgo/bson"
)
type PostArticle struct {
	Name         string        `json:"name"`
	Description  string        `json:"description"`
	BrowseCount  uint          `json:"browseCount"`
	Status       uint          `json:"status"`
	Content      string        `json:"content"`
	Tags         []string      `json:"tags"`
	Logo       	 string        `json:"logo"`
}
type articleListItem struct {
	ID           bson.ObjectId `json:"id" bson:"_id"`
	UpdatedAt    time.Time     `json:"updatedAt"`
	Name         string        `json:"name"`
	Description  string        `json:"description"`
	Author       model.Author  `json:"author"`
	Logo       	 string        `json:"logo"`
}
//获取文章详细数据
func GetArticleDetail(c *gin.Context) {
	var resData model.Article
	id := c.Param("id")
	if findErr := model.DB.C("articles").Find(bson.M{
		"_id": bson.ObjectIdHex(id),
	}).One(&resData); findErr != nil {
		pkg.SendBadResponse(c, "找不到该数据")
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"data": resData,
		"msg": "success",
	})
}
//创建文章
func CreateArticle(c *gin.Context) {
	var postData PostArticle
	var author model.Author
	userid, exist := c.Get("userid")
	if(!exist) {
		pkg.SendBadResponse(c, "服务端错误")
		return
	}
	if err := c.BindJSON(&postData); err != nil {
		pkg.SendBadResponse(c, "服务端错误")
		return
	}
	if findErr := model.DB.C("users").Find(bson.M{
		"_id": userid,
	}).One(&author); findErr != nil {
		pkg.SendBadResponse(c, "服务端错误")
		return
	}
	articleData := model.Article{
		ID:          bson.NewObjectId(),
		CreatedAt:   time.Now(),
		UpdatedAt:	 time.Now(),
		Name:        postData.Name,
		Description: postData.Description,
		BrowseCount: postData.BrowseCount,
		Status:      postData.Status,
		Content:     postData.Content,
		Tags:        postData.Tags,
		Author:      author,
		Logo:        postData.Logo,
	}
	if err := model.DB.C("articles").Insert(&articleData); err != nil {
		pkg.SendBadResponse(c, "服务端错误")
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"data": articleData.ID,
		"msg": "success",
	})
}
//获取文章预览列表数据
func GetArticleList(c *gin.Context) {
	articlelist := []articleListItem{}
	allArticlelist := []articleListItem{}
	var page, perPage int 
	var tag string
	pageQ:= c.Query("page")
	perPageQ := c.Query("perPage")
	tag = c.Query("tag")
	page, _ = strconv.Atoi(pageQ)
	perPage, _ = strconv.Atoi(perPageQ)
	if( page <= 0) {
		page = 1
	}
	if( perPage <= 0) {
		perPage = 10
	}
	findQuery := bson.M{
		"status": 1,
	}
	if( tag != "") {
		findQuery["tags"] = bson.M{
			"$elemMatch": bson.M{
				"$in": []string{ tag },
			},
		}
	}
	err := model.DB.C("articles").Find(findQuery).Sort("-createdat").Skip((page - 1) * perPage).Limit(perPage).All(&articlelist)
	allErr := model.DB.C("articles").Find(findQuery).All(&allArticlelist)
	
	if(err != nil || allErr != nil ) {
		pkg.SendBadResponse(c, "服务端错误")
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"data": gin.H{
			"list":articlelist,
			"count": len(allArticlelist),
		},
		"msg": "success",
	})
}
