package model

import (
	"time"
	"github.com/globalsign/mgo/bson"
)

type Article struct {
	ID           bson.ObjectId `json:"id" bson:"_id"`
	CreatedAt    time.Time     `json:"createdAt"`
	UpdatedAt    time.Time     `json:"updatedAt"`
	Name         string        `json:"name"`
	Description  string        `json:"description"`
	BrowseCount  uint          `json:"browseCount"`
	Status       uint          `json:"status"`
	Content      string        `json:"content"`
	Tags         []string      `json:"tags"`
	Author       Author        `json:"author"`
	Logo       	 string        `json:"logo"`
}

/*
	Status 0 未上线 1 上线
*/

type Author struct {
	UserName string         `json:"username"`
	ID       bson.ObjectId  `json:"id" bson:"_id"`
}

type BingImage struct {
	Date    string      `json:"date"`
	Value   string      `json:"value"`
}