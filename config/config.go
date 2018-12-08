package config

import (
	"encoding/json"
	"fmt"
	"os"
	"io/ioutil"
	"regexp"
	"github.com/xichengh/xcblog/utils"
)
type DataType struct {
	Mongodb    Mongodb  `json:"mongodb"`
	Base       Base     `json:"base"`
}
type Base struct {
	APIPrefix            string      `json:"APIPrefix"`           /*Api接口前缀*/
	UploadImgDir         string      `json:"UploadImgDir"`        /*Api接口前缀*/
	ImgPath              string      `json:"ImgPath"`             /*上传后的图片请求地址前缀*/
	MaxMultipartMemory   int64       `json:"MaxMultipartMemory"`  /*上传的图片最大允许的大小，单位MB*/
	Port                 int16       `json:"Port"`                /*go监听端口*/
	TokenSecret          string      `json:"TokenSecret"`         /*TokenSecret*/
	TokenMaxAge          int64       `json:"TokenMaxAge"`         /*token过期时间，单位秒*/
	CooKieMaxAge         int         `json:"CooKieMaxAge"`        /*cookie过期时间，单位秒*/
	LogFile              string                                   /*日志文件*/
	LogDir               string                                   /*日志目录*/
	ReleaseMode          bool                                     /*是否是上线发布模式*/
}
type  Mongodb struct  {
	Database  string   `json:"Database"`           /*数据库名称*/
	Address   string   `json:"Address"`            /*数据库地址*/
	UserName  string   `json:"UserName"`           /*数据库管理账号*/
	PassWord  string   `json:"PassWord"`           /*数据库密码*/
	Url       string   `json:"Url"`                /*用于连接数据库*/
}

var MongoConf Mongodb
var BaseConf Base


func logFile() {
	ymdStr := utils.GetTodayYMD("-")
	pwd, _ := os.Getwd()
	//如果配置了日志目录,将日志文件配置为绝对路径
	if BaseConf.LogDir != "" {
		if utils.CheckNotExist(BaseConf.LogDir) {
			utils.MkDir(pwd + BaseConf.LogDir)
		}
		BaseConf.LogDir = pwd + BaseConf.LogDir + "/"
	}
	BaseConf.LogFile = BaseConf.LogDir + ymdStr + ".log"
	BaseConf.ReleaseMode = os.Getenv("GO_ENV") == "production"
}
func mongoDialUrl() {
	MongoConf.Url = "mongodb://" + MongoConf.UserName + ":" + MongoConf.PassWord + "@" + MongoConf.Address + "/" + MongoConf.Database
	if MongoConf.UserName == "" || MongoConf.PassWord == "" {
		MongoConf.Url = "mongodb://" + MongoConf.Address
	} 
	
}
func initConfig() {
	var data DataType
	configFilePath := "config.json"
	if(len(os.Args) > 1) {
		configFilePath = os.Args[1]
	}
	configFile, err := os.Open(configFilePath)
	defer configFile.Close()
	if err != nil {
		fmt.Println("OpenFile: ", err.Error())
		os.Exit(-1)
	}
	bytes, _ := ioutil.ReadAll(configFile)
	configStr := string(bytes[:])
	reg := regexp.MustCompile(`/\*.*\*/`)  //去掉json文件中的注释
	configStr = reg.ReplaceAllString(configStr, "")
	bytes = []byte(configStr)
	json.Unmarshal(bytes, &data)
	MongoConf = data.Mongodb
	BaseConf = data.Base
	if !BaseConf.ReleaseMode {
		fmt.Println("---------------------配置文件加载完成-------------------")
	}
}

func init() {
	initConfig()
	mongoDialUrl()
	logFile()
}