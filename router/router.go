package router

import (
	"github.com/xichengh/xcblog/config"
	"github.com/xichengh/xcblog/controller/article"
	"github.com/xichengh/xcblog/controller/user"
	"github.com/xichengh/xcblog/controller/image"
	"github.com/gin-gonic/gin"
	mw "github.com/xichengh/xcblog/middleware"
	"github.com/xichengh/xcblog/spider"
)

// Route 路由
func Route(router *gin.Engine) {
	api := router.Group(config.BaseConf.APIPrefix)
	api.Use(mw.RefreshToken)
	{
		api.POST("/signin", user.SignIn)
		api.POST("/signup", user.SignUp)
		api.GET("/userinfo", mw.SigninRequired, user.Userinfo)
	}
	{
		api.GET("/article/:id",  article.GetArticleDetail)
		api.POST("/article/:id", mw.SigninRequired, article.CreateArticle)
		api.DELETE("/article/:id", mw.SigninRequired, article.DeleteArticle)
		api.PUT("/article/:id", mw.SigninRequired, article.UpdateArticle)
		api.GET("/tags",         article.GetTags)
		api.GET("/articlelist",  article.GetArticleList)
	}
	{
		api.GET("/bingimg", spider.GetBingBg)
	}
	{
		api.GET("/imagelist", image.GetImage)
		api.POST("/image", mw.SigninRequired, image.UploadImage)
	}
}
