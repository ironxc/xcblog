package main

import (
	"github.com/xichengh/xcblog/router"
	"fmt"
	"github.com/xichengh/xcblog/config"
	"github.com/gin-gonic/gin"
	// mw "code/middleware"
)

func main() {
	fmt.Println("gin.Version: ", gin.Version)

	// Creates a router without any middleware by default
	app := gin.New()

	// Global middleware
	// Logger middleware will write the logs to gin.DefaultWriter even if you set with GIN_MODE=release.
	// By default gin.DefaultWriter = os.Stdout
	app.Use(gin.Logger())
	// Recovery middleware recovers from any panics and writes a 500 if there was one.
	app.Use(gin.Recovery())
	app.Static(config.BaseConf.ImgPath, "./images")
	router.Route(app)
	// app.Use(mw.ErrorHandler)
	app.Run(":" + fmt.Sprintf("%d", config.BaseConf.Port))
}
