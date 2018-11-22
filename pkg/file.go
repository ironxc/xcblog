package pkg

import (
    "os"
	"crypto/md5"
	"crypto/rand"
	"encoding/base64"
	"encoding/hex"
	"io"
)
// 新建文件夹
func MkDir(src string) error {
    err := os.MkdirAll(src, os.ModePerm)
    return err
}
// 检查文件夹是否不存在
func CheckNotExist(src string) bool {
	_, err := os.Stat(src)
	return os.IsNotExist(err)
}
// md5加密
func EncodeMD5(value string) string {
	m := md5.New()
	m.Write([]byte(value))

	return hex.EncodeToString(m.Sum(nil))
}
// 获取唯一id
func UniqueId() string {
	b := make([]byte, 48)

	if _, err := io.ReadFull(rand.Reader, b); err != nil {
		return ""
	}
	return EncodeMD5(base64.URLEncoding.EncodeToString(b))
}