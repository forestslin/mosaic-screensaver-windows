# 🖼️ Windows Mosaic Screensavers (Album Art & Movie Posters)

[![Demo Preview](preview.jpg)](https://github.com/forestslin/mosaic-screensaver-windows/raw/main/demo.mp4)

**English Introduction**
A stunning collection of Windows screensavers inspired by macOS's classic "Artwork" (Album Art Mosaic) screensaver. It now includes **TWO** distinct screensavers: 
1. **Music Album Art Mosaic**: Fetches hundreds of high-res album covers from iTunes.
2. **Movie Poster Wall**: Displays gorgeous, vertical HD movie and TV show posters from TVMaze.

Both feature a dynamic, 3D flipping mosaic grid, multi-monitor support, zero dependencies (standalone executable), and a built-in settings UI to select your favorite music/movie genres. No local library required!

---

这是一个惊艳的 Windows 屏幕保护程序合集，灵感来源于 macOS 经典的 "Artwork" (专辑封面马赛克) 屏保。目前包含 **两款独立屏保**，可根据个人喜好随意安装和切换。它们能将数百张高清封面以马赛克网格的形式铺满你的屏幕，并随机进行 3D 翻转动画展示。

## 🎵 1. 音乐专辑马赛克 (Music Album Art Mosaic)
- **正方形专辑比例 (1:1)**：完美还原 macOS 经典的唱片墙效果。
- **海量高清封面**：无需本地音乐库！自动调用 iTunes API 随机获取你最爱的音乐类型。
- **28 种音乐流派可选**：内置原生的 Windows 设置面板，支持自由勾选 Pop, Rock, Jazz, K-Pop, 华语等多种音乐类型。

## 🎬 2. 电影海报墙 (Movie Poster Wall)
- **竖版海报比例 (2:3)**：独家定制的前端网格系统，完美呈现电影和优质剧集的竖版超清海报。
- **全球超清影视库**：基于 TVMaze 的全球影视数据库，自动抓取最高清的原版影视海报。
- **丰富的影视标签**：可以在设置中勾选 Action(动作), Sci-Fi(科幻), Chinese(华语影视), Romance(爱情) 等多达 28 种影视流派。

---

## 🌟 核心特性
- **纯正 macOS 风格体验**：平滑的 3D CSS 翻转动画 (`rotateY`)，带有景深悬浮阴影效果。
- **自动适配屏幕 (完美全屏)**：无论是 16:9 还是带鱼屏，都能精确计算网格大小，保证没有黑边，并且边缘图片绝不会被裁切得只剩一半。
- **支持多显示器**：会自动在你的所有显示器上全屏运行。
- **原生与现代的完美结合**：使用现代 Web 技术 (HTML/CSS/JS) 渲染炫酷的 3D 动画，并包裹在一个轻量级且 DPI 完美感知的 C# WinForms (WebView2) 壳中。

## 🚀 安装指南

### 方法 1：下载现成的单文件版 (推荐)
进入项目的 **[Release 页面](https://github.com/forestslin/mosaic-screensaver-windows/releases/latest)**，你可以找到两个现成的屏保文件：
- `MosaicScreensaver_Standalone.scr` (音乐屏保)
- `MoviePosterScreensaver_Standalone.scr` (电影屏保)

**使用方法**：
1. **测试**：双击下载的 `.scr` 文件即可直接全屏预览（动一下鼠标即可退出）。
2. **配置**：右键点击该 `.scr` 文件，选择 **配置 (Configure)**，勾选你喜欢的分类标签并保存。
3. **安装**：右键点击该 `.scr` 文件，选择 **安装 (Install)**。这将自动打开 Windows 的“屏幕保护程序设置”，将其应用为你的系统默认屏保。

### 方法 2：源码编译
如果你想自行编译此项目：
1. 确保你的电脑安装了 `.NET 6.0 SDK` 或更高版本。
2. 克隆此仓库。
3. 打开终端进入任意一个屏保目录（例如 `MosaicScreensaver` 或 `MoviePosterScreensaver`），运行：
   ```bash
   dotnet publish -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true -p:IncludeNativeLibrariesForSelfExtract=true -p:IncludeAllContentForSelfExtract=true
   ```
4. 到 `bin\Release\net6.0-windows\win-x64\publish\` 目录中找到生成的 `.exe`。
5. 将其后缀名重命名为 `.scr` 即可作为屏保使用。

## 🆕 更新日志 (Changelog)

### v3.0
- **【重磅】全新电影海报墙屏保发布！**：除音乐专辑外，现在推出了全新的电影海报专属屏保代码。
- **超清 2:3 海报比例**：完美适配竖版电影海报比例，视觉震撼。
- **28 种影视流派**：包含“动作”、“喜剧”、“科幻”，以及新增的“中国电影 (Chinese)”分类。

### v2.0
- **全新设置面板**：在 Windows 屏幕保护程序设置中点击“设置”，现在可以自由勾选多达 28 种分类！
- **修复黑边问题**：完美适配任何屏幕比例和多显示器，彻底消除所有黑边和封面裁切不完整问题。
- **自动发布更新**：集成了 GitHub Actions，自动构建并发布最新的单文件版屏保。

## 🛠️ 技术栈
- **前端**：Vanilla HTML5 + CSS3 (Grid & 3D Transforms) + JavaScript
- **外壳**：C# (.NET 6 Windows Forms) + Microsoft.Web.WebView2

## 📝 证书
MIT License
