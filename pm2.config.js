 module.exports = {
  apps: [
    {
      name: "app",
      script: "./config.json",   // script当成配置文件，在go中通过os.Args[1]获取到配置文件地址
      instances: 1,
      exec_mode: "fork",    // 一定要是fork
      interpreter: "./app",   // windows下加.exe
      env: {
        GO_ENV: "production",
      },
      env_dev: {
        GO_ENV: "devlopment",
      },
    }
  ]
}