package model

import (
	"github.com/globalsign/mgo"
	"github.com/xichengh/xcblog/config"
	"fmt"
)

var DB *mgo.Database

func initMongo() {
	fmt.Println(config.MongoConf.Url)
	session, err := mgo.Dial(config.MongoConf.Url)
	if( err != nil) {
		fmt.Println("========", err.Error())
	}
	DB = session.DB(config.MongoConf.Database)
}

func init() {
	initMongo()
}
