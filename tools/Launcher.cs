/* =========================================================================
   Vape V4 剪切板 —— 启动器 (VapeV4Clipboard.exe)
   做三件事：
     1. 起一个本地静态服务器（node server.js，找不到 node 就用 python）
     2. 用 Edge / Chrome 的 --app 模式打开成“独立窗口”（没有地址栏、没有标签页）
     3. 窗口关掉后结束服务器进程
   编译： csc /target:winexe /out:VapeV4剪切板.exe /win32icon:assets\app.ico Launcher.cs
   ========================================================================= */
using System;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Threading;
using System.Windows.Forms;

static class Launcher
{
    const int WIN_W = 1600, WIN_H = 900;

    [STAThread]
    static int Main(string[] args)
    {
        bool selftest = Array.IndexOf(args, "--selftest") >= 0;
        string dir = AppDomain.CurrentDomain.BaseDirectory.TrimEnd('\\');

        string node   = FindOnPath("node.exe");
        string python = FindOnPath("python.exe");
        string edge   = FirstExisting(new string[] {
            Environment.GetEnvironmentVariable("ProgramFiles(x86)") + @"\Microsoft\Edge\Application\msedge.exe",
            Environment.GetEnvironmentVariable("ProgramFiles")      + @"\Microsoft\Edge\Application\msedge.exe",
            Environment.GetEnvironmentVariable("ProgramFiles")      + @"\Google\Chrome\Application\chrome.exe",
            Environment.GetEnvironmentVariable("ProgramFiles(x86)") + @"\Google\Chrome\Application\chrome.exe",
            Environment.GetEnvironmentVariable("LocalAppData")      + @"\Google\Chrome\Application\chrome.exe"
        });

        if (selftest)
        {
            Console.WriteLine("appdir : " + dir);
            Console.WriteLine("node   : " + (node   ?? "(not found)"));
            Console.WriteLine("python : " + (python ?? "(not found)"));
            Console.WriteLine("browser: " + (edge   ?? "(not found)"));
            Console.WriteLine("index  : " + File.Exists(Path.Combine(dir, "index.html")));
            return (node != null || python != null) && edge != null && File.Exists(Path.Combine(dir, "index.html")) ? 0 : 1;
        }

        int port = FreePort();
        Process server = null;

        if (node != null)
            server = Spawn(node, "\"" + Path.Combine(dir, "server.js") + "\" " + port, dir);
        else if (python != null)
            server = Spawn(python, "-m http.server " + port + " --bind 127.0.0.1 --directory \"" + dir + "\"", dir);

        if (server == null)
        {
            MessageBox.Show("没有找到 node.exe 或 python.exe，无法启动本地服务。\n请安装 Node.js 后重试。",
                            "Vape V4 剪切板", MessageBoxButtons.OK, MessageBoxIcon.Error);
            return 2;
        }

        string url = "http://127.0.0.1:" + port + "/";
        if (!WaitForPort(port, 8000))
        {
            Kill(server);
            MessageBox.Show("本地服务启动超时。", "Vape V4 剪切板", MessageBoxButtons.OK, MessageBoxIcon.Error);
            return 3;
        }

        // 独立浏览器配置目录：窗口是干净的应用窗口，localStorage 也随程序保存
        string profile = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
            "VapeV4Clipboard", "profile");
        try { Directory.CreateDirectory(profile); } catch (Exception) { }

        string browserArgs =
            "--app=" + url +
            " --window-size=" + WIN_W + "," + WIN_H +
            " --user-data-dir=\"" + profile + "\"" +
            " --no-first-run --no-default-browser-check --disable-sync --disable-extensions" +
            " --disable-features=Translate,msEdgeTranslate,msEdgeSidebar,EdgeCollections";

        if (edge == null)
        {
            Process.Start(url);           // 没有 Edge/Chrome 就用默认浏览器
            Thread.Sleep(1500);
            Kill(server);
            return 0;
        }

        Process browser = Spawn(edge, browserArgs, dir);

        int autoclose = ArgValue(args, "--autoclose");   // 仅用于自动化验证
        if (autoclose > 0 && browser != null)
        {
            Thread.Sleep(autoclose * 1000);
            Kill(browser);
        }
        else if (browser != null)
        {
            try { browser.WaitForExit(); } catch (Exception) { }
        }
        Kill(server);
        return 0;
    }

    static int ArgValue(string[] args, string name)
    {
        for (int i = 0; i < args.Length - 1; i++)
            if (args[i] == name)
            {
                int v;
                if (int.TryParse(args[i + 1], out v)) return v;
            }
        return 0;
    }

    /* ------------------------------- 工具 ------------------------------- */
    static Process Spawn(string exe, string args, string workdir)
    {
        try
        {
            ProcessStartInfo psi = new ProcessStartInfo(exe, args);
            psi.WorkingDirectory = workdir;
            psi.UseShellExecute = false;
            psi.CreateNoWindow = true;
            return Process.Start(psi);
        }
        catch (Exception) { return null; }
    }

    static void Kill(Process p)
    {
        try { if (p != null && !p.HasExited) p.Kill(); } catch (Exception) { }
    }

    static string FindOnPath(string name)
    {
        string path = Environment.GetEnvironmentVariable("PATH") ?? "";
        foreach (string part in path.Split(';'))
        {
            if (part.Trim().Length == 0) continue;
            try
            {
                string full = Path.Combine(part.Trim(), name);
                if (File.Exists(full)) return full;
            }
            catch (Exception) { }
        }
        return null;
    }

    static string FirstExisting(string[] paths)
    {
        foreach (string p in paths)
            if (!string.IsNullOrEmpty(p) && File.Exists(p)) return p;
        return null;
    }

    static int FreePort()
    {
        TcpListener l = new TcpListener(IPAddress.Loopback, 0);
        l.Start();
        int port = ((IPEndPoint)l.LocalEndpoint).Port;
        l.Stop();
        return port;
    }

    static bool WaitForPort(int port, int timeoutMs)
    {
        DateTime end = DateTime.Now.AddMilliseconds(timeoutMs);
        while (DateTime.Now < end)
        {
            try
            {
                using (TcpClient c = new TcpClient())
                {
                    c.Connect(IPAddress.Loopback, port);
                    if (c.Connected) return true;
                }
            }
            catch (Exception) { Thread.Sleep(120); }
        }
        return false;
    }
}
