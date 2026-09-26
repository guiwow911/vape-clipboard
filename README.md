# Vape V4 Clipboard

**一个常驻桌面的透明悬浮剪切板管理器** —— Windows 无边框悬浮层，只有面板浮在壁纸上，空白处鼠标直接穿透。

基于 **Windows Forms + WebView2**，界面用纯 HTML/CSS/JS 复刻 Vape V4 视觉风格，
最终打包成**单个 exe**（网页资源与 WebView2 库全部内嵌，无需安装、无需 Node/Python）。

> ⚠️ **免责声明**：本项目只是一个**剪切板管理工具 + 界面皮肤**。
> 它**不包含任何游戏注入、内存读写、作弊或破坏游戏公平性的功能**，也**与 Vape 官方无任何关联**。
> "Vape V4" 仅指界面配色与排版风格。请勿将其用于任何违反游戏服务条款的场景。

[English](#english) · [下载](#下载) · [功能](#功能) · [自己编译](#自己编译)

---

## 下载

直接去 **[Releases](../../releases/latest)** 页面下载 `VapeV4Clipboard.exe`，双击即用，**免安装**。

- 首次运行若提示缺少 **WebView2 运行时**：Windows 10/11 装了 Edge 就自带；没有的话程序会弹窗引导你去微软官网装。
- `SHA256SUMS.txt` 可以用来核对下载的文件有没有损坏。

---

## 功能

### 桌宠式悬浮层

| 特性 | 说明 |
|---|---|
| 无边框透明窗口 | 没有标题栏、不进任务栏、不出现在 Alt+Tab 列表 |
| 鼠标穿透 | 空白处点下去直接穿透到桌面，只有面板本身接收鼠标 |
| 面板可拖动 | 拖标题栏即可摆放，位置自动记住 |
| 总在最前 | 面板始终浮在其他窗口之上 |

### 剪切板管理

- **复制即收** —— 在任何软件里 `Ctrl+C`，内容自动进面板，不用切窗口
- **图片也收** —— 截图、浏览器右键复制图片都能收；自动压缩到最长边 640px，小图存 PNG、大图转 JPEG
- **分类** —— 文本 / 链接 / 代码 / 收藏 / 图片，类型自动识别
- **搜索** —— `Ctrl+K` 聚焦搜索框
- **快捷槽** —— 把常用条目绑到 `1`–`9`，一键复制
- **转换** —— 纯文本 / 去首尾空白 / 转大写 / 转小写 / 格式化 JSON / Base64
- **导出导入** —— 全部数据（含昵称、头像、栏目名、固定与收藏状态）导出成 `.json`，导入时自动去重合并
- **自定义栏目** —— 自己新建栏目、选图标、命名，条目可自由移入移出
- **历史上限** —— 双三角滑块调节保留条数

### 折叠动画

面板折叠/展开为 **0.18s `max-height` 过渡**，动画期间只改 DOM 不整页重绘，
下方堆叠面板同步平滑滑位，折叠时保存滚动位置、展开后恢复，避免内容跳变。

### 全局快捷键

- 默认 **右 Shift**，在任何程序里（包括全屏游戏）都能开关界面
- 按一下切换，**按住不放只算一次**（已过滤键盘自动重复）
- 可在设置里改成 `F1`–`F12`、`Insert`、`Home`、`End`、`PageUp/Down`、`Pause`、`ScrollLock`、左右 `Shift`、右 `Ctrl`、右 `Alt`
- 只接受**不影响正常打字**的键，避免全局吞掉打字按键
- 可整体关闭

---

## 截图

> 欢迎提 PR 补充截图：把界面截图放到 `docs/` 目录，然后在下面插入。

<!-- ![screenshot](docs/screenshot.png) -->

---

## 系统要求

| 项目 | 要求 |
|---|---|
| 系统 | Windows 10 / 11（x64） |
| 运行时 | **WebView2 Runtime**（装过 Edge 即有） |
| 其他 | 无需安装，无需 Node / Python / .NET SDK |

**绿色便携模式**：给 exe 设一个环境变量 `VAPE_DATA_DIR=<某个文件夹>`，
数据就全放那儿，不再写 `%LOCALAPPDATA%`。

---

## 数据存放位置

```
%LOCALAPPDATA%\VapeV4Clipboard\
├── clips.json      剪切板内容、栏目名、面板位置、头像昵称、自定义栏目
├── hotkey.txt      当前快捷键
├── log.txt         启动日志
├── WebView2\       界面自身的存储（localStorage）
└── runtime\<版本>\  从 exe 内解包出来的网页资源
```

- `clips.json` 每次改动后自动写盘（**先写 `.tmp` 再改名**，断电也不会写坏）
- 托盘右键 →「打开数据文件夹」可直接跳过去
- 整个文件夹删掉 = 恢复出厂

---

## 自己编译

只需要 **Windows + Python 3**（用系统自带的 .NET Framework 编译器，不用装 Visual Studio）。

```bash
git clone https://github.com/<your-name>/vape-clipboard.git
cd vape-clipboard
python tools/build_single.py
```

产物在 `dist/VapeV4Clipboard.exe`，同时生成 `dist/SHA256SUMS.txt`。

加 `--desktop` 可顺便复制到桌面并建快捷方式（作者本地发布用）：

```bash
python tools/build_single.py --desktop
```

### 只改界面时快速预览

网页文件在 `src/web/`，可以脱离 exe 直接在浏览器里调：

```bash
node tools/server.js        # http://127.0.0.1:8788/
```

> 用 http 而不是直接双击 `index.html`，是因为只有安全上下文才能调用系统剪切板 API。

### 自动发布

仓库带了 GitHub Actions（`.github/workflows/release.yml`）：
推一个 `v*` 的 tag，CI 会自动编译并把 exe 挂到 Release 上。

```bash
git tag v1.0.0
git push origin v1.0.0
```

---

## 项目结构

```
vape-clipboard/
├── src/
│   ├── VapeApp.cs              悬浮层源码（窗口/穿透/托盘/热键/剪切板捕获）
│   └── web/
│       ├── index.html          界面结构 + SVG 图标精灵
│       ├── style.css           Vape V4 皮肤样式
│       └── app.js              界面逻辑（渲染/动画/交互）
├── lib/                        WebView2 SDK（编译期引用 + 内嵌进 exe）
├── assets/                     图标与图片资源
├── tools/
│   ├── build_single.py         一键编译单文件 exe
│   ├── server.js               开发预览用的本地静态服务器
│   └── Launcher.cs             启动器（可选，用来自我提权/清理启动）
├── .github/workflows/          CI 自动构建与发布
├── LICENSE
└── README.md
```

### 实现要点

- **透明 + 穿透**：`TransparencyKey` 抠掉窗口背景；`WS_EX_TRANSPARENT` 做鼠标穿透，
  由页面里的 `window.vapeHitTest(x, y)` 命中测试决定当前该不该接收鼠标
- **单文件打包**：网页资源与 DLL 以 `/resource:` 内嵌进 exe，运行时按 `BUILD` 哈希解包到
  `%LOCALAPPDATA%\...\runtime\<哈希>\`；哈希由网页资源内容算出，所以改了界面一定会重新解包
- **全局热键**：`WH_KEYBOARD_LL` 低级键盘钩子，用 `rshiftDown` 标记过滤自动重复
- **新窗口拦截**：`NewWindowRequested` 直接 `Handled = true`，防止界面里点出浏览器窗口

---

## 常见问题

**按右 Shift 没反应？**
可能被别的软件占用了。托盘右键 →「快捷键：…（点击修改）」换一个键，或先确认「启用快捷键」是勾上的。

**面板挡住了桌面图标点击？**
托盘右键切换「空白处鼠标穿透」。

**改了界面代码但没生效？**
重新跑 `python tools/build_single.py` 生成新 exe；直接改 `%LOCALAPPDATA%` 里解包出来的文件也能即时生效（重启程序即可）。

---

## English

A transparent, always-on-top **clipboard manager overlay for Windows**, styled after the Vape V4 UI.
Built with WinForms + WebView2 and shipped as a **single self-contained .exe** (web assets and the
WebView2 libraries are embedded — no installer, no Node, no Python needed).

Download the latest `VapeV4Clipboard.exe` from **[Releases](../../releases/latest)**.

**This is a clipboard tool and UI skin only.** It performs no game injection, memory reading,
or cheating of any kind, and is not affiliated with Vape.

Build from source on Windows: `python tools/build_single.py`

---

## License

项目的自有源码以 [MIT](LICENSE) 授权。
`lib/` 下的 WebView2 组件属于 Microsoft，遵循其各自的许可条款，不受 MIT 约束。
