/* =========================================================================
   Vape V4 剪切板 —— 桌宠式悬浮层 (Windows Forms + WebView2)
   * 无边框、无标题栏、不进任务栏；窗口铺满工作区，背景透明
   * 只有面板下面的地方接鼠标，空白处鼠标穿透（桌面照常点）
   * 托盘图标右键菜单：显示/隐藏、鼠标穿透、总在最前、重置布局、开机启动、退出
   * 面板可以随便拖，位置记在页面 localStorage 里

   编译：
     csc /target:winexe /platform:x64 /out:VapeV4剪切板.exe /win32icon:assets\app.ico
         /r:System.dll /r:System.Core.dll /r:System.Drawing.dll /r:System.Windows.Forms.dll
         /r:Microsoft.Web.WebView2.Core.dll /r:Microsoft.Web.WebView2.WinForms.dll VapeApp.cs
   ========================================================================= */
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Globalization;
using System.IO;
using System.Reflection;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;
using System.Web.Script.Serialization;
using System.Windows.Forms;
using Microsoft.Win32;
using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.WinForms;

class VapeApp : Form
{
    const string HOST = "vape.local";
    const string RUNTIME_URL = "https://go.microsoft.com/fwlink/?LinkId=2124703";
    const string RUN_KEY = @"Software\Microsoft\Windows\CurrentVersion\Run";
    const string RUN_NAME = "VapeV4Clipboard";

    /* 透明键控色：界面上不会出现的怪颜色，用它抠掉窗口背景 */
    static readonly Color KEY = Color.FromArgb(255, 1, 2, 3);

    const int GWL_EXSTYLE      = -20;
    const int WS_EX_TRANSPARENT = 0x00000020;
    const int WS_EX_TOOLWINDOW  = 0x00000080;

    [DllImport("user32.dll", SetLastError = true)]
    static extern int GetWindowLong(IntPtr hWnd, int nIndex);
    [DllImport("user32.dll", SetLastError = true)]
    static extern int SetWindowLong(IntPtr hWnd, int nIndex, int dwNewLong);

    /* ---- 全局键盘钩子：右 Shift 开关界面（在游戏里也一样按） ---- */
    const int WH_KEYBOARD_LL = 13;
    const int WM_KEYDOWN = 0x0100, WM_SYSKEYDOWN = 0x0104;
    const int VK_RSHIFT = 0xA1;
    const int WM_KEYUP = 0x0101, WM_SYSKEYUP = 0x0105;
    delegate IntPtr LowLevelKeyboardProc(int nCode, IntPtr wParam, IntPtr lParam);
    [DllImport("user32.dll", SetLastError = true)]
    static extern IntPtr SetWindowsHookEx(int idHook, LowLevelKeyboardProc lpfn, IntPtr hMod, uint dwThreadId);
    [DllImport("user32.dll", SetLastError = true)]
    static extern bool UnhookWindowsHookEx(IntPtr hhk);
    [DllImport("user32.dll")]
    static extern IntPtr CallNextHookEx(IntPtr hhk, int nCode, IntPtr wParam, IntPtr lParam);
    [DllImport("kernel32.dll")]
    static extern IntPtr GetModuleHandle(string lpModuleName);
    [DllImport("user32.dll")]
    static extern bool SetForegroundWindow(IntPtr hWnd);
    [DllImport("user32.dll")]
    static extern uint GetClipboardSequenceNumber();   // 剪贴板变化计数：没变就不用干活

    static IntPtr hookId = IntPtr.Zero;
    static LowLevelKeyboardProc hookProc;      // 保住引用，别被 GC
    static VapeApp current;
    public bool hotkeyEnabled = true;          // 快捷键开关（托盘里可关）
    static int hotkeyVk = 0xA1;                // 当前快捷键（默认右 Shift），可在托盘里改
    static string hotkeyName = "右Shift";
    static bool capturingHotkey;               // 录制快捷键时钩子全程放行

    WebView2 web;
    NotifyIcon tray;
    Timer hover;
    Timer clipTimer;
    Timer hideTimer;             // 关闭动画的兜底计时器
    bool pendingHide;
    bool introPlaying;           // 注入动画播放中：强制可交互 / 抢焦点 / 右Shift 用来跳过
    DateTime animSent;
    string lastClip;
    bool autoCapture = true;     // 自动捕获系统剪切板（复制任何地方都会收进来）
    bool passThrough = true;     // 空白处是否穿透
    bool? interactive = null;    // 当前窗口是否在接收鼠标（null = 还没设置过）
    bool busy;                   // 命中测试进行中
    bool hidden;
    bool startupAdded;

    static string AppDir { get { return AppDomain.CurrentDomain.BaseDirectory.TrimEnd('\\'); } }
    static string DataDir
    {
        get
        {
            /* 设了 VAPE_DATA_DIR 就用它（绿色便携模式 / 测试用），否则用 %LOCALAPPDATA% */
            string custom = Environment.GetEnvironmentVariable("VAPE_DATA_DIR");
            string d = string.IsNullOrEmpty(custom)
                ? Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "VapeV4Clipboard")
                : custom;
            Directory.CreateDirectory(d);
            return d;
        }
    }

    [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
    static extern bool SetDllDirectory(string lpPathName);

    /* ---------------- 单文件打包：把内核 DLL 与网页资源都塞进 exe ---------------- */
    const string BUILD = "428ebcb967";        // 改界面时改这个，运行时会重新解包
    static readonly string[] WEB_FILES = {
        "index.html", "style.css", "app.js",
        "assets/app.ico", "assets/bg.jpg", "assets/donate.jpg", "assets/logo.png"
    };

    static string RuntimeDir { get { return Path.Combine(DataDir, "runtime", BUILD); } }

    static byte[] ReadResource(string id)
    {
        try
        {
            using (Stream s = Assembly.GetExecutingAssembly().GetManifestResourceStream(id))
            {
                if (s == null) return null;
                byte[] buf = new byte[s.Length];
                int read = 0;
                while (read < buf.Length)
                {
                    int n = s.Read(buf, read, buf.Length - read);
                    if (n <= 0) break;
                    read += n;
                }
                return buf;
            }
        }
        catch (Exception) { return null; }
    }

    static string ResName(string file) { return "web_" + file.Replace('/', '_').Replace('\\', '_'); }

    /* 解包网页资源，返回可以挂给虚拟域名的目录；没有内嵌资源就返回 exe 所在目录 */
    static string PrepareWeb()
    {
        string dir = RuntimeDir;
        string stamp = Path.Combine(dir, ".ok");
        if (File.Exists(stamp)) return dir;
        try
        {
            Directory.CreateDirectory(dir);
            int n = 0;
            foreach (string f in WEB_FILES)
            {
                byte[] b = ReadResource(ResName(f));
                if (b == null) continue;
                string target = Path.Combine(dir, f.Replace('/', Path.DirectorySeparatorChar));
                Directory.CreateDirectory(Path.GetDirectoryName(target));
                File.WriteAllBytes(target, b);
                n++;
            }
            if (n > 0) { File.WriteAllText(stamp, BUILD); return dir; }
        }
        catch (Exception ex) { Log("prepare web fail " + ex.Message); }
        return AppDir;                       // 回退：用 exe 旁边的散文件
    }

    /* 原生 WebView2Loader.dll 必须先落到磁盘，再让搜索路径指过去 */
    static void PrepareNativeLoader()
    {
        try
        {
            string root = Path.Combine(DataDir, "runtime");
            Directory.CreateDirectory(root);
            /* 清掉旧版本的解包目录 */
            try
            {
                foreach (string d in Directory.GetDirectories(root))
                    if (Path.GetFileName(d) != BUILD) Directory.Delete(d, true);
            }
            catch (Exception) { }

            string dir = RuntimeDir;
            Directory.CreateDirectory(dir);
            string dll = Path.Combine(dir, "WebView2Loader.dll");
            if (!File.Exists(dll))
            {
                byte[] b = ReadResource("vw2loader");
                if (b != null) File.WriteAllBytes(dll, b);
            }
            if (File.Exists(dll)) SetDllDirectory(dir);
        }
        catch (Exception ex) { Log("prepare loader fail " + ex.Message); }
    }

    /* 托管 DLL 也从内嵌资源里加载（找不到资源就走原来的同目录加载） */
    static Assembly ResolveEmbedded(object sender, ResolveEventArgs args)
    {
        try
        {
            string simple = new AssemblyName(args.Name).Name;
            string id = simple == "Microsoft.Web.WebView2.Core" ? "vw2core"
                      : simple == "Microsoft.Web.WebView2.WinForms" ? "vw2forms" : null;
            if (id == null) return null;
            byte[] b = ReadResource(id);
            return b == null ? null : Assembly.Load(b);
        }
        catch (Exception) { return null; }
    }

    [STAThread]
    static void Main(string[] a)
    {
        AppDomain.CurrentDomain.AssemblyResolve += ResolveEmbedded;
        PrepareNativeLoader();
        RealMain(a);                          // 放到 NoInlining 方法里，避免过早加载 WebView2 类型
    }

    [MethodImpl(MethodImplOptions.NoInlining)]
    static void RealMain(string[] a)
    {
        Log("=== start " + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + " ===");
        Application.EnableVisualStyles();
        Application.SetCompatibleTextRenderingDefault(false);
        LoadHotkey();
        try
        {
            current = new VapeApp();
            hookProc = HookCallback;
            using (System.Diagnostics.Process p = System.Diagnostics.Process.GetCurrentProcess())
            using (System.Diagnostics.ProcessModule m = p.MainModule)
                hookId = SetWindowsHookEx(WH_KEYBOARD_LL, hookProc, GetModuleHandle(m.ModuleName), 0);
            Log("keyboard hook " + (hookId != IntPtr.Zero ? "ok" : "FAIL"));

            Application.Run(current);
            Log("=== exit ok ===");
        }
        catch (Exception ex)
        {
            Log("FATAL " + ex);
            MessageBox.Show("启动失败：\n" + ex.Message, "Vape V4 剪切板", MessageBoxButtons.OK, MessageBoxIcon.Error);
        }
        finally
        {
            if (hookId != IntPtr.Zero) UnhookWindowsHookEx(hookId);
        }
    }

    /* 快捷键：按一次开关界面（按住产生的自动重复忽略掉），并吃掉按键不出字符 */
    static bool rshiftDown;                    // 物理按键是否还按着
    static IntPtr HookCallback(int nCode, IntPtr wParam, IntPtr lParam)
    {
        if (nCode >= 0 && !capturingHotkey)     // 录制快捷键时全程放行
        {
            int msg = (int)wParam;
            int vk = Marshal.ReadInt32(lParam);

            if (vk == hotkeyVk)
            {
                /* 抬起：清掉“按着”的标记，按键照样吞掉 */
                if (msg == WM_KEYUP || msg == WM_SYSKEYUP)
                {
                    rshiftDown = false;
                    if (current != null && current.hotkeyEnabled) return (IntPtr)1;
                }
                else if (msg == WM_KEYDOWN || msg == WM_SYSKEYDOWN)
                {
                    bool repeat = rshiftDown;       // 已经是按下状态 = 长按重复，不触发
                    rshiftDown = true;
                    if (current != null && current.hotkeyEnabled)
                    {
                        if (!repeat)
                        {
                            VapeApp app = current;
                            try
                            {
                                if (app.introPlaying)
                                    app.BeginInvoke((MethodInvoker)delegate {
                                        app.RunScript("window.__injClose && window.__injClose();");   // 动画期间 = 跳过
                                    });
                                else
                                    app.BeginInvoke((MethodInvoker)delegate { app.ToggleHidden(); });
                            }
                            catch (Exception) { }
                        }
                        return (IntPtr)1;           // 吞掉，避免输入字符
                    }
                }
            }
        }
        return CallNextHookEx(hookId, nCode, wParam, lParam);
    }

    static void Log(string msg)
    {
        try { File.AppendAllText(Path.Combine(DataDir, "log.txt"), msg + Environment.NewLine, System.Text.Encoding.UTF8); }
        catch (Exception) { }
    }

    public VapeApp()
    {
        Text = "Vape V4 剪切板";
        FormBorderStyle = FormBorderStyle.None;
        ShowInTaskbar = false;
        TopMost = true;
        StartPosition = FormStartPosition.Manual;
        Bounds = Screen.PrimaryScreen.WorkingArea;
        BackColor = KEY;
        TransparencyKey = KEY;
        KeyPreview = true;
        try { Icon = Icon.ExtractAssociatedIcon(Application.ExecutablePath); } catch (Exception) { }

        web = new WebView2();
        web.Dock = DockStyle.Fill;
        web.DefaultBackgroundColor = Color.Transparent;   // 关键：让页面背景透出桌面
        Controls.Add(web);

        BuildTray();

        hover = new Timer();
        hover.Interval = 120;
        hover.Tick += OnHoverTick;

        clipTimer = new Timer();
        clipTimer.Interval = 500;
        clipTimer.Tick += OnClipTick;

        hideTimer = new Timer();
        hideTimer.Interval = 700;
        hideTimer.Tick += delegate (object s, EventArgs a)
        {
            hideTimer.Stop();
            if (pendingHide) DoHide();      // 页面没回 animDone 也别卡住
        };

        Load += OnLoaded;
        FormClosing += delegate { SaveState(); };
    }

    protected override void OnHandleCreated(EventArgs e)
    {
        base.OnHandleCreated(e);
        try
        {
            /* 桌宠式：不出现在 Alt+Tab 列表里 */
            int ex = GetWindowLong(Handle, GWL_EXSTYLE);
            SetWindowLong(Handle, GWL_EXSTYLE, ex | WS_EX_TOOLWINDOW);
        }
        catch (Exception) { }
    }

    /* ------------------------------- 托盘 ------------------------------- */
    void BuildTray()
    {
        ContextMenuStrip menu = new ContextMenuStrip();
        menu.Items.Add(Item("显示界面", delegate { ShowUi(); }));
        menu.Items.Add(Item("隐藏到托盘", delegate { HideUi(); }));
        menu.Items.Add(Item("添加 / 粘贴内容…", delegate { RunScript("openEditor();"); }));
        menu.Items.Add(Item("重播注入动画", delegate { RunScript("playInjectIntro();"); }));
        menu.Items.Add(Item("导出剪切板…", delegate { RunScript("exportEntries();"); }));
        menu.Items.Add(Item("导入剪切板…", delegate { RunScript("startImport();"); }));
        menu.Items.Add(Item("打开数据文件夹", delegate {
            try { System.Diagnostics.Process.Start("explorer.exe", DataDir); } catch (Exception) { }
        }));
        menu.Items.Add(new ToolStripSeparator());

        ToolStripMenuItem miHot = Check("启用快捷键", true, delegate (bool on) {
            hotkeyEnabled = on;
            Log("hotkey -> " + on);
        });
        menu.Items.Add(miHot);

        miHotkey = new ToolStripMenuItem("快捷键：" + hotkeyName + "（点击修改）");
        miHotkey.Click += delegate { PickHotkey(); };
        menu.Items.Add(miHotkey);

        ToolStripMenuItem miCap = Check("复制即收（自动捕获剪切板）", true, delegate (bool on) {
            autoCapture = on;
            Log("autoCapture -> " + on);
        });
        menu.Items.Add(miCap);

        ToolStripMenuItem miPass = Check("空白处鼠标穿透", true, delegate (bool on) {
            passThrough = on;
            ApplyPassThrough();
            Log("passThrough -> " + on);
        });
        menu.Items.Add(miPass);

        menu.Items.Add(Item("窗口总在最前", delegate {
            TopMost = !TopMost;
            Log("topmost -> " + TopMost);
        }));
        menu.Items.Add(new ToolStripSeparator());
        menu.Items.Add(Item("重置面板布局", delegate { RunScript("state.pos={};save();render();"); }));
        menu.Items.Add(Item("面板重新排成默认列", delegate { RunScript("state.pos={};state.zoom=1;fit();save();render();"); }));
        menu.Items.Add(Item("界面放大 / 还原", delegate { RunScript("state.zoom=(state.zoom>1?1:1.25);fit();save();"); }));
        menu.Items.Add(new ToolStripSeparator());
        menu.Items.Add(Item("开机自动启动", delegate { ToggleStartup(); }));
        menu.Items.Add(new ToolStripSeparator());
        menu.Items.Add(Item("退出", delegate { Close(); }));

        tray = new NotifyIcon();
        tray.Icon = Icon != null ? Icon : SystemIcons.Application;
        tray.Text = "Vape V4 剪切板（双击显示界面）";
        tray.ContextMenuStrip = menu;
        tray.Visible = true;
        tray.DoubleClick += delegate { ShowUi(); };
    }

    static ToolStripMenuItem Check(string text, bool on, Action<bool> changed)
    {
        ToolStripMenuItem it = new ToolStripMenuItem(text);
        it.CheckOnClick = true;
        it.Checked = on;
        it.CheckedChanged += delegate { changed(it.Checked); };
        return it;
    }

    void ShowUi()
    {
        hidden = false;
        pendingHide = false;
        hideTimer.Stop();
        Visible = true;
        TopMost = true;
        ApplyPassThrough();
        hover.Start();
        PostJson(new { cmd = "anim", dir = "in" });     // 页面播开启动画
        Log("UI shown");
    }

    /* 隐藏：先让页面播 0.22s 的关闭动画，收到 animDone 再真正隐藏 */
    void HideUi()
    {
        if (!Visible){ hidden = true; return; }
        pendingHide = true;
        animSent = DateTime.Now;
        PostJson(new { cmd = "anim", dir = "out" });
        hideTimer.Stop();
        hideTimer.Start();
        Log("hide: anim out sent");
    }

    void DoHide()
    {
        pendingHide = false;
        hideTimer.Stop();
        hidden = true;
        Visible = false;
        Log("UI hidden" + (animSent == default(DateTime) ? "" :
            " (+" + (int)(DateTime.Now - animSent).TotalMilliseconds + "ms)"));
    }

    static ToolStripMenuItem Item(string text, EventHandler handler)
    {
        ToolStripMenuItem it = new ToolStripMenuItem(text);
        it.Click += handler;
        return it;
    }

    void ToggleHidden()
    {
        if (hidden) ShowUi(); else HideUi();
    }

    /* ---------------------------- 内核初始化 ---------------------------- */
    async void OnLoaded(object sender, EventArgs e)
    {
        Log("overlay bounds " + Bounds.Width + "x" + Bounds.Height);
        try
        {
            CoreWebView2EnvironmentOptions opts = new CoreWebView2EnvironmentOptions("--disable-http-cache");
            CoreWebView2Environment env =
                await CoreWebView2Environment.CreateAsync(null, Path.Combine(DataDir, "WebView2"), opts);
            Log("environment ok " + env.BrowserVersionString);
            await web.EnsureCoreWebView2Async(env);
            Log("corewebview2 ok");
        }
        catch (Exception ex)
        {
            Log("INIT FAIL " + ex);
            DialogResult r = MessageBox.Show(
                "没有找到 WebView2 运行库（Windows 10/11 一般自带）。\n\n是否现在去微软官网下载安装？\n\n" + ex.Message,
                "Vape V4 剪切板", MessageBoxButtons.YesNo, MessageBoxIcon.Warning);
            if (r == DialogResult.Yes) { try { System.Diagnostics.Process.Start(RUNTIME_URL); } catch (Exception) { } }
            Close();
            return;
        }

        CoreWebView2 core = web.CoreWebView2;
        CoreWebView2Settings s = core.Settings;
        s.AreDefaultContextMenusEnabled = false;
        s.AreDevToolsEnabled = false;
        s.IsStatusBarEnabled = false;
        s.IsZoomControlEnabled = false;
        s.AreBrowserAcceleratorKeysEnabled = false;
        s.IsPasswordAutosaveEnabled = false;
        s.IsGeneralAutofillEnabled = false;

        core.PermissionRequested += delegate (object o, CoreWebView2PermissionRequestedEventArgs ev)
        {
            if (ev.PermissionKind == CoreWebView2PermissionKind.ClipboardRead)
                ev.State = CoreWebView2PermissionState.Allow;
        };
        core.NewWindowRequested += delegate (object o, CoreWebView2NewWindowRequestedEventArgs ev) { ev.Handled = true; };

        /* 页面来的命令：hide / quit / export / import */
        core.WebMessageReceived += delegate (object o, CoreWebView2WebMessageReceivedEventArgs ev)
        {
            string cmd = null, text = null;
            Dictionary<string, object> d = null;
            try
            {
                d =
                    new JavaScriptSerializer().Deserialize<Dictionary<string, object>>(ev.WebMessageAsJson);
                object v;
                if (d != null && d.TryGetValue("cmd", out v) && v != null) cmd = v.ToString();
                if (d != null && d.TryGetValue("text", out v) && v != null) text = v.ToString();
            }
            catch (Exception) { return; }

            if (cmd == "hide") ToggleHidden();
            else if (cmd == "quit") Close();
            else if (cmd == "animDone") { if (pendingHide) DoHide(); }
            else if (cmd == "intro")
            {
                introPlaying = (text == "on");
                Log("intro " + (introPlaying ? "start" : "end"));
                if (introPlaying)
                {
                    SetInteractive(true);                 // 动画期间整块窗口都吃鼠标，点哪都能跳过
                    try { Activate(); SetForegroundWindow(Handle); } catch (Exception) { }
                }
                else ApplyPassThrough();
            }
            else if (cmd == "introDone") Log("inject intro finished");
            else if (cmd == "export") DoExport(text);
            else if (cmd == "import") DoImport();
            else if (cmd == "persist") SaveClips(text);
            else if (cmd == "copyImage") CopyImageToClipboard(text);
            else if (cmd == "saveImage") SaveImageFile(text, null);
            else if (cmd == "grabImage") GrabImage(true);
            else if (cmd == "setHotkey") {
                object vkVal;
                int vk = 0;
                if (d != null && d.TryGetValue("vk", out vkVal) && vkVal != null)
                    int.TryParse(vkVal.ToString(), out vk);
                if (vk != 0) SetHotkey(vk);
            }
        };

        core.SetVirtualHostNameToFolderMapping(HOST, PrepareWeb(), CoreWebView2HostResourceAccessKind.Allow);
        core.NavigationCompleted += delegate (object o, CoreWebView2NavigationCompletedEventArgs ev)
        {
            Log("navigation " + ev.IsSuccess);
            ApplyPassThrough();
            hover.Start();
            try { lastClip = Clipboard.ContainsText() ? Clipboard.GetText() : null; } catch (Exception) { }
            clipTimer.Start();
            PostJson(new { cmd = "hotkey", text = hotkeyName });   // 让页面显示当前快捷键
            if (ev.IsSuccess) LoadClipsIntoPage();   // 本地文件里的内容推回页面
        };
        /* 带时间戳导航：保证 index.html 每次都从磁盘重读（界面改了立刻生效） */
        string navUrl = "https://" + HOST + "/index.html?t=" + DateTime.Now.Ticks;
        core.Navigate(navUrl);
        Log("navigating " + navUrl);
    }

    /* ---------------- 剪切板内容落盘：clips.json ---------------- */
    static string ClipsFile { get { return Path.Combine(DataDir, "clips.json"); } }

    void SaveClips(string json)
    {
        if (string.IsNullOrEmpty(json)) return;
        try
        {
            string tmp = ClipsFile + ".tmp";
            File.WriteAllText(tmp, json, new System.Text.UTF8Encoding(true));
            if (File.Exists(ClipsFile)) File.Delete(ClipsFile);
            File.Move(tmp, ClipsFile);
            Log("clips saved " + new FileInfo(ClipsFile).Length + " bytes");
        }
        catch (Exception ex) { Log("save clips fail " + ex.Message); }
    }

    void LoadClipsIntoPage()
    {
        try
        {
            if (!File.Exists(ClipsFile)) return;
            string json = File.ReadAllText(ClipsFile, System.Text.Encoding.UTF8);
            if (json.Length > 0) PostJson(new { cmd = "fileData", text = json });
        }
        catch (Exception ex) { Log("load clips fail " + ex.Message); }
    }

    /* ------------------------- 快捷键设置 ------------------------- */
    static string HotkeyFile { get { return Path.Combine(DataDir, "hotkey.txt"); } }

    static bool SafeHotkey(int vk)
    {
        /* 只允许不影响正常打字的键：F1–F12、Ins/Del/Home/End/PgUp/PgDn、右/左 Shift、右 Ctrl、右 Alt、Pause、ScrollLock */
        if (vk >= 0x70 && vk <= 0x7B) return true;                  // F1..F12
        if (vk >= 0x21 && vk <= 0x28) return true;                  // PgUp/PgDn/End/Home/箭头
        if (vk == 0x2D || vk == 0x2E || vk == 0x13 || vk == 0x91) return true;  // Ins/Del/Pause/ScrollLock
        if (vk == 0xA0 || vk == 0xA1 || vk == 0xA3 || vk == 0xA5) return true;  // 左右Shift/右Ctrl/右Alt
        return false;
    }

    static string HotkeyLabel(int vk)
    {
        if (vk == 0xA1) return "右Shift";
        if (vk == 0xA0) return "左Shift";
        if (vk == 0xA3) return "右Ctrl";
        if (vk == 0xA5) return "右Alt";
        if (vk == 0x2D) return "Insert";
        if (vk == 0x2E) return "Delete";
        if (vk == 0x24) return "Home";
        if (vk == 0x23) return "End";
        if (vk == 0x21) return "PageUp";
        if (vk == 0x22) return "PageDown";
        if (vk == 0x13) return "Pause";
        if (vk == 0x91) return "ScrollLock";
        if (vk >= 0x70 && vk <= 0x7B) return "F" + (vk - 0x6F);
        return "VK" + vk;
    }

    static void LoadHotkey()
    {
        try
        {
            if (!File.Exists(HotkeyFile)) return;
            int vk;
            if (int.TryParse(File.ReadAllText(HotkeyFile).Trim(), out vk) && SafeHotkey(vk))
            {
                hotkeyVk = vk;
                hotkeyName = HotkeyLabel(vk);
                Log("hotkey loaded: " + hotkeyName + " (" + vk + ")");
            }
        }
        catch (Exception) { }
    }

    void SetHotkey(int vk)
    {
        hotkeyVk = vk;
        hotkeyName = HotkeyLabel(vk);
        rshiftDown = false;
        try { File.WriteAllText(HotkeyFile, vk.ToString()); } catch (Exception) { }
        if (miHotkey != null) miHotkey.Text = "快捷键：" + hotkeyName + "（点击修改）";
        PostJson(new { cmd = "hotkey", text = hotkeyName });
        Log("hotkey -> " + hotkeyName + " (" + vk + ")");
        ShowUi();
    }

    ToolStripMenuItem miHotkey;

    void PickHotkey()
    {
        using (Form dlg = new Form())
        {
            dlg.Text = "设置快捷键";
            dlg.FormBorderStyle = FormBorderStyle.FixedDialog;
            dlg.MinimizeBox = false; dlg.MaximizeBox = false;
            dlg.StartPosition = FormStartPosition.CenterScreen;
            dlg.ClientSize = new Size(340, 130);
            dlg.TopMost = true; dlg.ShowInTaskbar = false;
            dlg.BackColor = Color.FromArgb(26, 26, 26);
            dlg.ForeColor = Color.FromArgb(230, 230, 230);

            Label lbl = new Label();
            lbl.Dock = DockStyle.Fill;
            lbl.TextAlign = ContentAlignment.MiddleCenter;
            lbl.Text = "请按下要用的按键…\n\n当前：" + hotkeyName +
                       "\n（Esc 取消 · Backspace 恢复默认右Shift）";
            lbl.Font = new Font("Microsoft YaHei UI", 9.5f);
            dlg.Controls.Add(lbl);

            capturingHotkey = true;
            dlg.KeyPreview = true;
            dlg.KeyDown += delegate (object s, KeyEventArgs e)
            {
                if (e.KeyCode == Keys.Escape){ dlg.Close(); return; }
                if (e.KeyCode == Keys.Back){ SetHotkey(0xA1); dlg.Close(); return; }
                int vk = (int)e.KeyCode;
                if (!SafeHotkey(vk))
                {
                    lbl.Text = "这个键会影响正常打字，换一个吧\n\n推荐：F1–F12、右Shift、Insert、Home…";
                    return;
                }
                SetHotkey(vk);
                dlg.Close();
            };
            dlg.FormClosed += delegate { capturingHotkey = false; };
            dlg.ShowDialog(this);
            capturingHotkey = false;
        }
    }

    /* --------------------------- 导出 / 导入 --------------------------- */
    void PostJson(object payload)
    {
        try
        {
            if (web.CoreWebView2 != null)
                web.CoreWebView2.PostWebMessageAsJson(new JavaScriptSerializer().Serialize(payload));
        }
        catch (Exception) { }
    }

    void DoExport(string json)
    {
        if (string.IsNullOrEmpty(json)) return;
        hover.Stop();
        try
        {
            using (SaveFileDialog d = new SaveFileDialog())
            {
                d.Title = "导出剪切板";
                d.Filter = "JSON 文件 (*.json)|*.json|所有文件 (*.*)|*.*";
                d.FileName = "vape-clipboard-" + DateTime.Now.ToString("yyyyMMdd-HHmm") + ".json";
                if (d.ShowDialog(this) == DialogResult.OK)
                {
                    File.WriteAllText(d.FileName, json, new System.Text.UTF8Encoding(true));
                    Log("exported " + d.FileName);
                    PostJson(new { cmd = "toast", text = "已导出：" + Path.GetFileName(d.FileName) });
                }
            }
        }
        catch (Exception ex)
        {
            PostJson(new { cmd = "toast", text = "导出失败：" + ex.Message });
        }
        hover.Start();
    }

    void DoImport()
    {
        hover.Stop();
        try
        {
            using (OpenFileDialog d = new OpenFileDialog())
            {
                d.Title = "导入剪切板";
                d.Filter = "JSON 文件 (*.json)|*.json|文本文件 (*.txt)|*.txt|所有文件 (*.*)|*.*";
                if (d.ShowDialog(this) == DialogResult.OK)
                {
                    string txt = File.ReadAllText(d.FileName, System.Text.Encoding.UTF8);
                    Log("imported " + d.FileName);
                    PostJson(new { cmd = "import", text = txt });
                }
            }
        }
        catch (Exception ex)
        {
            PostJson(new { cmd = "toast", text = "导入失败：" + ex.Message });
        }
        hover.Start();
    }

    /* ------------------- 图片剪切板：读取 / 写回 / 存文件 ------------------- */
    string lastImageSig;

    static string EncodeImage(Image src, out int w, out int h)
    {
        w = src.Width; h = src.Height;
        const int MAX = 640;                       // 控制体积：最长边 640
        double k = Math.Min(1.0, (double)MAX / Math.Max(src.Width, src.Height));
        int tw = Math.Max(1, (int)(src.Width * k));
        int th = Math.Max(1, (int)(src.Height * k));
        using (Bitmap bmp = new Bitmap(tw, th))
        {
            using (Graphics g = Graphics.FromImage(bmp))
            {
                g.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
                g.PixelOffsetMode = System.Drawing.Drawing2D.PixelOffsetMode.HighQuality;
                g.Clear(Color.White);
                g.DrawImage(src, 0, 0, tw, th);
            }
            using (MemoryStream ms = new MemoryStream())
            {
                bmp.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
                if (ms.Length <= 200 * 1024)       // 小图直接 PNG（清晰）
                    return "data:image/png;base64," + Convert.ToBase64String(ms.ToArray());
            }
            using (MemoryStream ms = new MemoryStream())
            {
                bmp.Save(ms, System.Drawing.Imaging.ImageFormat.Jpeg);
                return "data:image/jpeg;base64," + Convert.ToBase64String(ms.ToArray());
            }
        }
    }

    static byte[] DecodeDataUrl(string dataUrl)
    {
        if (string.IsNullOrEmpty(dataUrl)) return null;
        int comma = dataUrl.IndexOf(',');
        if (comma < 0) return null;
        try { return Convert.FromBase64String(dataUrl.Substring(comma + 1)); }
        catch (Exception) { return null; }
    }

    void GrabImage(bool force)
    {
        try
        {
            if (!Clipboard.ContainsImage()) return;
            Image src = Clipboard.GetImage();
            if (src == null) return;
            int w, h;
            string data = EncodeImage(src, out w, out h);
            src.Dispose();
            string sig = data.Length + ":" + data.Substring(Math.Max(0, data.Length - 48));
            if (!force && sig == lastImageSig) return;
            lastImageSig = sig;
            PostJson(new { cmd = "clipImage", data, w, h });
            Log("image captured " + w + "x" + h);
        }
        catch (Exception ex) { Log("grab image fail " + ex.Message); }
    }

    void CopyImageToClipboard(string dataUrl)
    {
        byte[] bytes = DecodeDataUrl(dataUrl);
        if (bytes == null) return;
        try
        {
            using (MemoryStream ms = new MemoryStream(bytes))
            using (Image img = Image.FromStream(ms))
            {
                lastImageSig = dataUrl.Length + ":" + dataUrl.Substring(Math.Max(0, dataUrl.Length - 48));
                Clipboard.SetImage(img);       // 顺带记录指纹，避免又被“复制即收”抓一次
                Log("image copied to clipboard");
            }
        }
        catch (Exception ex) { PostJson(new { cmd = "toast", text = "复制图片失败：" + ex.Message }); }
    }

    void SaveImageFile(string dataUrl, string name)
    {
        byte[] bytes = DecodeDataUrl(dataUrl);
        if (bytes == null) return;
        bool png = dataUrl.IndexOf("image/png", StringComparison.OrdinalIgnoreCase) > 0;
        hover.Stop();
        try
        {
            using (SaveFileDialog d = new SaveFileDialog())
            {
                d.Title = "保存图片";
                d.Filter = png ? "PNG 图片 (*.png)|*.png|所有文件 (*.*)|*.*"
                               : "JPEG 图片 (*.jpg)|*.jpg|所有文件 (*.*)|*.*";
                d.FileName = string.IsNullOrEmpty(name) ? "clip-image.png" : name;
                if (d.ShowDialog(this) == DialogResult.OK)
                {
                    File.WriteAllBytes(d.FileName, bytes);
                    PostJson(new { cmd = "toast", text = "已保存：" + Path.GetFileName(d.FileName) });
                }
            }
        }
        catch (Exception ex) { PostJson(new { cmd = "toast", text = "保存失败：" + ex.Message }); }
        hover.Start();
    }

    /* ------------------- 自动捕获系统剪切板（复制即收） ------------------- */
    uint lastClipSeq = uint.MaxValue;

    void OnClipTick(object sender, EventArgs e)
    {
        if (!autoCapture) return;
        CoreWebView2 core = web.CoreWebView2;
        if (core == null) return;
        try
        {
            /* 剪贴板没变过就直接跳过：不再重复读文本、更不会重复编码图片 */
            uint seq = GetClipboardSequenceNumber();
            if (seq != 0)
            {
                if (seq == lastClipSeq) return;
                lastClipSeq = seq;
            }

            if (Clipboard.ContainsImage()){ GrabImage(false); return; }   // 图片优先
            if (!Clipboard.ContainsText()) return;
            string txt = Clipboard.GetText();
            if (string.IsNullOrEmpty(txt) || txt == lastClip) return;
            lastClip = txt;
            PostJson(new { cmd = "clip", text = txt });
        }
        catch (Exception) { }
    }

    /* ------------------------- 鼠标穿透（桌宠关键） ------------------------- */
    Point lastHoverPt = new Point(int.MinValue, int.MinValue);
    int hoverIdle;

    void OnHoverTick(object sender, EventArgs e)
    {
        if (introPlaying){ SetInteractive(true); return; }   // 动画期间不做穿透判断
        if (busy || !passThrough || web.CoreWebView2 == null) return;
        if (!Visible) { SetInteractive(false); return; }
        Point pt = PointToClient(Cursor.Position);
        if (pt.X < 0 || pt.Y < 0 || pt.X >= ClientSize.Width || pt.Y >= ClientSize.Height)
        {
            SetInteractive(false);
            return;
        }
        /* 光标没动就不用反复问页面（每 ~1.2s 兜底查一次，防止界面在光标下变化） */
        if (pt == lastHoverPt && ++hoverIdle < 10) return;
        lastHoverPt = pt;
        hoverIdle = 0;
        busy = true;
        string js = "!!(window.vapeHitTest && window.vapeHitTest(" +
                    pt.X.ToString(CultureInfo.InvariantCulture) + "," +
                    pt.Y.ToString(CultureInfo.InvariantCulture) + "))";
        web.CoreWebView2.ExecuteScriptAsync(js).ContinueWith(delegate (System.Threading.Tasks.Task<string> t)
        {
            busy = false;
            if (t.IsFaulted) return;
            SetInteractive(t.Result == "true");
        });
    }

    void SetInteractive(bool on)
    {
        if (interactive == on) return;
        interactive = on;
        try
        {
            int ex = GetWindowLong(Handle, GWL_EXSTYLE);
            if (on) ex &= ~WS_EX_TRANSPARENT;
            else    ex |= WS_EX_TRANSPARENT;
            SetWindowLong(Handle, GWL_EXSTYLE, ex);
            Log(on ? "mouse: interactive" : "mouse: click-through");
        }
        catch (Exception ex2) { Log("SetInteractive fail " + ex2.Message); }
    }

    void ApplyPassThrough()
    {
        if (!passThrough) SetInteractive(true);
        else SetInteractive(false);
    }

    /* ------------------------------- 杂项 ------------------------------- */
    void RunScript(string js)
    {
        if (web.CoreWebView2 == null) return;
        web.CoreWebView2.ExecuteScriptAsync(js);
    }

    void ToggleStartup()
    {
        try
        {
            using (RegistryKey k = Registry.CurrentUser.OpenSubKey(RUN_KEY, true))
            {
                if (k == null) return;
                if (k.GetValue(RUN_NAME) == null)
                {
                    k.SetValue(RUN_NAME, "\"" + Application.ExecutablePath + "\"");
                    startupAdded = true;
                }
                else
                {
                    k.DeleteValue(RUN_NAME, false);
                    startupAdded = false;
                }
            }
        }
        catch (Exception ex) { Log("startup fail " + ex.Message); }
    }

    void SaveState()
    {
        try
        {
            using (RegistryKey k = Registry.CurrentUser.OpenSubKey(RUN_KEY, false))
                startupAdded = k != null && k.GetValue(RUN_NAME) != null;
        }
        catch (Exception) { }
    }
}
