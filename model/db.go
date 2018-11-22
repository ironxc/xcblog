package model

import (
	"github.com/globalsign/mgo"
)

var DB *mgo.Database

func initMongo() {
	session, _ := mgo.Dial("localhost:27017")
	DB = session.DB("blog")
}

func init() {
	initMongo()
}
