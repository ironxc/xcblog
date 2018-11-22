package model
import (
	"time"
	"github.com/globalsign/mgo/bson"
)
type Image struct {
	ID      bson.ObjectId `json:"id" bson:"_id"`
	Path    string        `json:"path"`
	Date    time.Time     `json:"date"`
}
type SaveImage struct {
	Path    string        `json:"path"`
	Date    time.Time     `json:"date"`
}