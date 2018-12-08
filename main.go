package main

import (
	"github.com/xichengh/xcblog/router"
	"fmt"
	"os"
	"io"
	"github.com/xichengh/xcblog/config"
	"github.com/gin-gonic/gin"
)

func main() {
	fmt.Println("gin.Version: ", gin.Version)
	if config.BaseConf.ReleaseMode {
		gin.SetMode(gin.ReleaseMode)
		// Disable Console Color, you don't need console color when writing the logs to file.
		gin.DisableConsoleColor()
		// Logging to a file.
		logFile, err := os.OpenFile(config.BaseConf.LogFile, os.O_WRONLY|os.O_APPEND|os.O_CREATE, 0666)
		if err != nil {
			fmt.Printf(err.Error())
			os.Exit(-1)
		}
		gin.DefaultWriter = io.MultiWriter(logFile)
	}
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
