package model

import (
	"time"
	"github.com/globalsign/mgo/bson"
)

type User struct {
	ID        bson.ObjectId `json:"id" bson:"_id"`
	CreatedAt time.Time     `json:"createdAt"`
	UpdatedAt time.Time     `json:"updatedAt"`
	Name      string        `json:"name"`
	Email     string        `json:"email"`
	Signature string        `json:"signature"`
	Avatar    string        `json:"avatar"`
	UserName  string        `json:"username"`
	PassWord  string        `json:"password"`
}
