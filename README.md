# Vape V4 剪切板 — 开源源码包

本文件夹包含 VapeV4Clipboard 的开源源码。

## 目录结构

```
vape-开源源码/
├── README.md           # 项目说明
├── .gitignore          # Git忽略规则
├── src/
│   ├── VapeApp.cs      # C# 主程序 (Windows Forms + WebView2)
│   ├── web/            # [待补充] 前端页面：index.html, style.css, app.js
│   └── assets/         # [待补充] 图标和背景图
└── tests/
    ├── test_vape_listfor.js   # 分类逻辑测试
    └── test_import.js         # 导入导出测试
```

## 待补充文件

以下文件当前不在本工作目录中，如需完整开源需手动添加：

| 路径 | 说明 |
|------|------|
| `src/web/index.html` | 前端入口 HTML |
| `src/web/style.css` | 样式表 |
| `src/web/app.js` | 前端核心逻辑 |
| `src/assets/app.ico` | 应用图标 |
| `src/assets/bg.jpg` | 背景图 |
| `src/assets/donate.jpg` | 赞助图 |
| `src/assets/logo.png` | Logo |

## 编译方式

```powershell
csc /target:winexe /platform:x64 /out:VapeV4剪切板.exe /win32icon:src\assets\app.ico `
    /r:System.dll /r:System.Core.dll /r:System.Drawing.dll /r:System.Windows.Forms.dll `
    /r:Microsoft.Web.WebView2.Core.dll /r:Microsoft.Web.WebView2.WinForms.dll `
    src\VapeApp.cs
```

## 上传到 GitHub

```powershell
cd vape-开源源码
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/guiwow911/vape-clipboard.git
git push -u origin main
```

## 数据来源

- 原始编译产物：`VapeV4剪切板-备份-2026-09-27-122520.exe`（1.4MB）
- 测试脚本：`test_vape_listfor.js`, `test_import.js`
- C# 源码：从备份 exe 反编译整理（`enc_test\NoBom.cs`）
