package config

import (
	"encoding/json"
	"fmt"
	"os"
	"io/ioutil"
	"regexp"
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
	CooKieMaxAge         int         `json:"CooKieMaxAge"`         /*cookie过期时间，单位秒*/
}
type  Mongodb struct  {
	Database  string   `json:"Database"`           /*数据库名称*/
	Host      string   `json:"Host"`               /*数据库ip*/
	Port      int16    `json:"Port"`               /*数据库端口*/
	UserName  string   `json:"UserName"`           /*数据库管理账号*/
	PassWord  string   `json:"PassWord"`           /*数据库密码*/
}

var MongoConf Mongodb
var BaseConf Base

func initConfig() {
	var data DataType
	configFile, err := os.Open("config.json")
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
}

func init() {
	initConfig()
}