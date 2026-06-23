# 🖼️ Windows Universal Mosaic Screensaver (Album Art & Movie Posters & Book Covers)

[![Demo Preview](preview.jpg)](https://github.com/forestslin/mosaic-screensaver-windows/raw/main/demo.mp4)

**English Introduction**
A stunning Windows screensaver inspired by macOS's classic "Artwork" (Album Art Mosaic) screensaver. It merges **Music Album Art**, **Movie Posters**, and **Book Covers** into a single customizable screensaver:
1. **Music Album Art Mosaic**: Fetches hundreds of high-res album covers from iTunes (1:1 aspect ratio).
2. **Movie Poster Wall**: Displays gorgeous, vertical HD movie and TV show posters from TVMaze (2:3 aspect ratio).
3. **Book Cover Library**: Showcases high-quality book covers, with an exclusive mode just for Chinese literature via iTunes API.
4. **Mixed Mode**: Displays everything side-by-side in alternating columns, perfectly filling the screen without black borders.
5. **Animation Styles**: Choose between the classic 3D Tile Flip, or a smooth continuous Left-to-Right Flow.

Features multi-monitor support, zero dependencies (standalone executable), and a built-in settings UI to select your display mode and favorite genres.

---

这是一个惊艳的 Windows 屏幕保护程序，灵感来源于 macOS 经典的 "Artwork" (专辑封面马赛克) 屏保。现已将 **音乐唱片墙**、**电影海报墙** 与 **书籍封面墙** 完美合而为一！你可以在设置面板中自由选择展示纯唱片墙、纯电影海报墙、纯书籍墙，或者三者大混搭，并提供两种惊艳的视觉动效，且完美适配任何屏幕比例，无任何黑边。

## 🌟 核心特性
- **支持五大展示模式**：
  - **仅音乐专辑 (1:1 比例)**：完美还原 macOS 唱片墙效果。
  - **仅电影海报 (2:3 比例)**：呈现大气的电影和剧集海报墙。
  - **仅书籍封面 (2:3 比例)**：展示经典名著与流行小说的书籍封面。
  - **唱片与海报混搭**：采用精巧的交替列布局，方圆与长宽巧妙融于一屏。
  - **海陆空全混搭**：音乐、电影、书籍封面三位一体交替展示！
- **专属中文图书模式**：特别支持“仅中文图书”模式，从苹果商店获取超清的中文小说、武侠、科幻、历史等纯正中文封面。
- **两种顶级动效**：
  - **经典 3D 翻转**：复刻 macOS 的网格 3D 随机翻转效果。
  - **自左向右流动**：全新加入的跑马灯流动特效，一张张封面平滑地自左向右无限滑过，极具沉浸感。
- **丰富的流派标签**：内置设置面板，支持分别勾选数十种音乐与电影流派 (Pop, Rock, Action, Sci-Fi, 华语电影等)。
- **动效频率可调**：可在设置中设定 1-5 档速度，定制你的专属动效节奏。
- **多显示器支持**：自动在所有连接的显示器上全屏运行。
- **单文件独立运行**：基于 .NET 6 和 WebView2 封装，无需安装多余依赖。

## 🚀 安装指南

### 方法 1：下载现成的单文件版 (推荐)
进入项目的 **[Release 页面](https://github.com/forestslin/mosaic-screensaver-windows/releases/latest)**，下载：
- `MosaicScreensaver_Standalone.scr` （或最新的 `v5.0.x.zip` 包内的 `.scr` 文件）

**使用方法**：
1. **配置**：右键点击该 `.scr` 文件，选择 **配置 (Configure)**，选择展示模式并勾选喜欢的流派，设定动效风格和速度。
2. **测试**：双击 `.scr` 文件即可直接全屏预览（动一下鼠标或按任意键即可退出）。
3. **安装**：右键点击该 `.scr` 文件，选择 **安装 (Install)** 应用为默认系统屏保。

### 方法 2：源码编译
如果你想自行编译此项目：
1. 确保你的电脑安装了 `.NET 6.0 SDK` 或更高版本。
2. 克隆此仓库。
3. 打开终端进入项目目录，运行：
   ```bash
   dotnet publish -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true -p:IncludeNativeLibrariesForSelfExtract=true -p:IncludeAllContentForSelfExtract=true
   ```
4. 到 `bin\Release\net6.0-windows\win-x64\publish\` 目录中找到生成的 `.exe`。
5. 将其后缀名重命名为 `.scr` 即可作为屏保使用。

## 🆕 更新日志 (Changelog)

### v5.0.x
- **【全新内容】加入书籍封面**：新增书籍封面展示，带来浓浓的书卷气！包含全球小说，更专属定制了“仅中文图书”模式，直连苹果图书库，呈现绝佳的高清中文武侠、科幻（如《三体》）封面。
- **【全新动效】平滑流动模式**：除经典的随机 3D 翻转外，新增了“一张张自左向右流动”的平滑跑马灯动效，满屏覆盖，极其惊艳。

### v4.0
- **【重磅】合二为一的终极版本**：将“音乐唱片墙”和“电影海报墙”完美合并为一个通用屏保程序。
- **智能混搭排版**：混搭模式下采用交替列布局，方正的唱片与竖版的电影海报巧妙融于一屏，填满全屏无黑边且无裁切拉伸。

### v3.2
- **【新增】封面翻转频率调节**：新增了“封面翻转频率”调节滑块（1-5档），可随心定制翻转的节奏。

### v3.0
- **【重磅】全新电影海报墙屏保发布！**：推出全新的电影海报专属屏保模式，完美适配竖版电影海报比例。

### v2.0
- **全新设置面板**：可以自由勾选多达 28 种分类！
- **修复黑边问题**：完美适配任何屏幕比例和多显示器，彻底消除所有黑边和封面裁切不完整问题。

## 🛠️ 技术栈
- **前端**：Vanilla HTML5 + CSS3 (Grid, Flexbox, Web Animations API, 3D Transforms) + JavaScript
- **外壳**：C# (.NET 6 Windows Forms) + Microsoft.Web.WebView2

## 📝 证书
MIT License
