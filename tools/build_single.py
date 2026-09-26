# -*- coding: utf-8 -*-
"""把整个程序编译成「单个 exe」。

单文件里塞了：WebView2 的两个托管 DLL、原生 WebView2Loader.dll，
以及 index.html / style.css / app.js / assets 全部资源。
运行时自动解包到 %LOCALAPPDATA%\\VapeV4Clipboard\\runtime\\<版本>\\。

用法：
    python tools/build_single.py              # 产物输出到 dist/
    python tools/build_single.py --desktop    # 额外复制到桌面并建快捷方式

依赖：Windows 自带的 .NET Framework 编译器 csc.exe（无需装 VS / SDK）。
"""
import os
import re
import sys
import shutil
import hashlib
import subprocess

ROOT   = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC    = os.path.join(ROOT, "src")
WEB    = os.path.join(SRC, "web")
LIB    = os.path.join(ROOT, "lib")
ASSETS = os.path.join(ROOT, "assets")
DIST   = os.path.join(ROOT, "dist")

EXE_NAME = "VapeV4Clipboard.exe"
CSC      = os.path.join(
    os.environ.get("WINDIR", r"C:\Windows"),
    r"Microsoft.NET\Framework64\v4.0.30319\csc.exe",
)

# (磁盘路径, 内嵌资源名) —— 资源名必须和 VapeApp.cs 的 WEB_FILES / ReadResource 对应
RES = [
    (os.path.join(WEB, "index.html"), "web_index.html"),
    (os.path.join(WEB, "style.css"),  "web_style.css"),
    (os.path.join(WEB, "app.js"),     "web_app.js"),
    (os.path.join(ASSETS, "app.ico"),    "web_assets_app.ico"),
    (os.path.join(ASSETS, "bg.jpg"),     "web_assets_bg.jpg"),
    (os.path.join(ASSETS, "donate.jpg"), "web_assets_donate.jpg"),
    (os.path.join(ASSETS, "logo.png"),   "web_assets_logo.png"),
    (os.path.join(LIB, "Microsoft.Web.WebView2.Core.dll"),     "vw2core"),
    (os.path.join(LIB, "Microsoft.Web.WebView2.WinForms.dll"), "vw2forms"),
    (os.path.join(LIB, "WebView2Loader.dll"),                  "vw2loader"),
]


def die(msg):
    print("错误：" + msg)
    sys.exit(1)


def main():
    if not os.path.isfile(CSC):
        die("找不到 csc.exe：\n  %s\n请确认是 Windows 且装有 .NET Framework 4.x。" % CSC)

    missing = [p for p, _ in RES if not os.path.isfile(p)]
    if missing:
        die("缺少以下文件：\n  " + "\n  ".join(missing))

    os.makedirs(DIST, exist_ok=True)
    out = os.path.join(DIST, EXE_NAME)
    if os.path.exists(out):
        os.remove(out)

    # 版本号 = 网页资源的哈希。单文件 exe 只在 BUILD 变化时才重新解包网页资源，
    # 所以每次编译都按资源内容写一个新 BUILD，保证界面改动一定生效。
    h = hashlib.sha1()
    for path, _ in RES:
        with open(path, "rb") as f:
            h.update(f.read())
    stamp = h.hexdigest()[:10]

    cs = os.path.join(SRC, "VapeApp.cs")
    with open(cs, encoding="utf-8") as f:
        src = f.read()
    new_src, n = re.subn(r'const string BUILD = "[^"]*";',
                         'const string BUILD = "%s";' % stamp, src, count=1)
    if n:
        with open(cs, "w", encoding="utf-8") as f:
            f.write(new_src)
        print("BUILD 版本号 -> %s" % stamp)

    args = [
        CSC, "/nologo", "/target:winexe", "/platform:x64", "/optimize+",
        "/out:" + out,
        "/win32icon:" + os.path.join(ASSETS, "app.ico"),
        "/r:System.dll", "/r:System.Core.dll", "/r:System.Drawing.dll",
        "/r:System.Windows.Forms.dll", "/r:System.Web.Extensions.dll",
        "/r:" + os.path.join(LIB, "Microsoft.Web.WebView2.Core.dll"),
        "/r:" + os.path.join(LIB, "Microsoft.Web.WebView2.WinForms.dll"),
    ]
    for path, name in RES:
        args.append("/resource:%s,%s" % (path, name))
    args.append(cs)

    r = subprocess.run(args, capture_output=True, text=True)
    if r.returncode != 0:
        print("编译失败：")
        print(r.stdout or "", r.stderr or "")
        sys.exit(1)

    size = os.path.getsize(out)
    print("单文件 exe: %s  (%.2f MB)" % (out, size / 1048576.0))

    # 校验和，方便下载的人核对
    sha = hashlib.sha256()
    with open(out, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            sha.update(chunk)
    sums = os.path.join(DIST, "SHA256SUMS.txt")
    with open(sums, "w", encoding="utf-8") as f:
        f.write("%s  %s\n" % (sha.hexdigest(), EXE_NAME))
    print("SHA256 -> %s" % sha.hexdigest())

    if "--desktop" in sys.argv:
        copy_to_desktop(out)
    return out


def copy_to_desktop(exe):
    """把 exe 放到桌面并生成快捷方式（本地发布用，加 --desktop 触发）。"""
    desk = None
    try:
        import ctypes
        from ctypes import wintypes
        buf = ctypes.create_unicode_buffer(wintypes.MAX_PATH)
        ctypes.windll.shell32.SHGetFolderPathW(None, 0, None, 0, buf)  # CSIDL_DESKTOP
        desk = buf.value or None
    except Exception:
        pass
    if not desk:
        desk = os.path.join(os.path.expanduser("~"), "Desktop")
    if not os.path.isdir(desk):
        print("跳过桌面复制：找不到桌面目录")
        return

    dst = os.path.join(desk, EXE_NAME)
    try:
        if os.path.exists(dst):
            old = dst + ".old"
            try:
                if os.path.exists(old):
                    os.remove(old)
                os.rename(dst, old)
            except Exception:
                pass
        shutil.copy2(exe, dst)
        print("已放到桌面:", dst)
    except Exception as e:
        print("复制到桌面失败（程序可能正开着）：", e)
        return

    lnk = os.path.join(desk, "Vape V4 Clipboard.lnk")
    ps = ("$s=(New-Object -ComObject WScript.Shell).CreateShortcut('%s');"
          "$s.TargetPath='%s';"
          "$s.WorkingDirectory='%s';"
          "$s.IconLocation='%s,0';"
          "$s.Description='Vape V4 Clipboard';"
          "$s.Save()") % (lnk, dst, desk, dst)
    try:
        subprocess.run(["powershell", "-NoProfile", "-Command", ps],
                       check=True, capture_output=True)
        print("快捷方式 ->", lnk)
    except Exception as e:
        print("快捷方式创建失败:", e)


if __name__ == "__main__":
    main()
