# Album Art Mosaic Screensaver for Windows

![Demo Video](https://github.com/forestslin/mosaic-screensaver-windows/raw/main/demo.mp4)

**English Introduction**
A stunning Windows screensaver inspired by macOS's classic "Artwork" (Album Art Mosaic) screensaver. It fetches hundreds of high-res album covers from iTunes and displays them in a dynamic, 3D flipping mosaic grid. Features include multi-monitor support, zero dependencies (standalone executable), and a built-in settings UI to select from 28+ music genres (Pop, Rock, K-Pop, Jazz, etc.). No local music library required!

---

这是一个惊艳的 Windows 屏幕保护程序，灵感来源于 macOS 经典的 "Artwork" (专辑封面马赛克) 屏保。它能将数百张高清音乐专辑封面以马赛克网格的形式铺满你的屏幕，并随机进行 3D 翻转动画展示。

## 🌟 核心特性
- **纯正 macOS 风格体验**：平滑的 3D CSS 翻转动画 (`rotateY`)，带有景深悬浮阴影效果。
- **自动适配屏幕 (完美全屏)**：无论是 16:9 还是带鱼屏，都能精确计算网格大小，保证没有黑边，并且边缘图片绝不会被裁切得只剩一半。
- **支持多显示器**：会自动在你的所有显示器上全屏运行。
- **海量高清封面**：无需本地音乐库！自动调用 iTunes API 随机获取 Pop, Rock, Jazz 等类别下超过 600 张 **超高清 (600x600 px)** 专辑封面，让你永远看不腻。
- **原生与现代的完美结合**：使用现代 Web 技术 (HTML/CSS/JS) 渲染炫酷的 3D 动画，并包裹在一个轻量级且 DPI 完美感知的 C# WinForms (WebView2) 壳中。

## 🚀 安装指南

### 方法 1：下载现成的单文件版 (推荐)
如果你在 Release 页面下载了 `MosaicScreensaver_Standalone.scr`：
1. **测试**：双击 `.scr` 文件即可直接全屏预览（动一下鼠标即可退出）。
2. **安装**：右键点击该 `.scr` 文件，选择 **安装 (Install)**。这将自动打开 Windows 的“屏幕保护程序设置”，将其应用为你的系统默认屏保。

### 方法 2：源码编译
如果你想自行编译此项目：
1. 确保你的电脑安装了 `.NET 6.0 SDK` 或更高版本。
2. 克隆此仓库。
3. 打开终端进入 `MosaicScreensaver` 目录，运行：
   ```bash
   dotnet publish -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true -p:IncludeNativeLibrariesForSelfExtract=true -p:IncludeAllContentForSelfExtract=true
   ```
4. 到 `bin\Release\net6.0-windows\win-x64\publish\` 目录中找到生成的 `.exe`。
5. 将其后缀名重命名为 `.scr` 即可作为屏保使用。

## 🆕 更新日志 (Changelog)

### v2.0
- **全新设置面板**：在 Windows 屏幕保护程序设置中点击“设置”，现在可以自由勾选多达 28 种音乐类型！
- **修复黑边问题**：完美适配任何屏幕比例和多显示器，彻底消除所有黑边和封面裁切不完整问题。
- **自动发布更新**：集成了 GitHub Actions，自动构建并发布最新的单文件版屏保。

### v1.0
- 初始版本发布，支持 macOS 风格 3D 马赛克翻转动画。

## 🛠️ 技术栈
- **前端**：Vanilla HTML5 + CSS3 (Grid & 3D Transforms) + JavaScript
- **外壳**：C# (.NET 6 Windows Forms) + Microsoft.Web.WebView2

## 📝 证书
MIT License
