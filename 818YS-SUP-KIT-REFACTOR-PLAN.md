# 📱 818ys-sup-kit 重构计划

**项目**: 818勇士助手 Android 重构版  
**目标**: 使用现代 Android 技术栈重构旧版 818ys-sup  
**参考**: android-project（鳄霸助手反编译样本）  
**状态**: 基础框架已搭建，待完善核心功能  
**日期**: 2026-02-09

---

## 📊 项目现状分析

### 当前技术栈 ✅
```kotlin
// 已完成的基础架构
- Kotlin 1.9.24
- Jetpack Compose（Modern UI）
- Android SDK 34 (targetSdk)
- Android 8.0+ (minSdk 26)
- Gradle 8.1.0
- Material Design 3

// 已集成的核心库
- Room Database (本地数据)
- ML Kit OCR (文字识别)
- CameraX (相机功能)
- WorkManager (后台任务)
- Rhino JS Engine (脚本引擎)
- Coroutines (异步处理)
```

### 已完成的模块 ✅
```
app/src/main/java/com/ys818/supkit/
├── ui/
│   ├── home/           # 首页
│   ├── ocr/            # OCR 功能
│   ├── settings/       # 设置页面
│   ├── diagnostics/    # 诊断工具
│   ├── components/     # 通用组件
│   └── theme/          # 主题样式
├── viewmodel/          # 视图模型层
│   ├── HomeViewModel
│   ├── OcrViewModel
│   ├── AutomationViewModel
│   ├── DiagnosticsViewModel
│   ├── SettingsViewModel
│   ├── UiAutomationViewModel
│   └── ScriptEditorViewModel
└── (待完成的业务层)
```

**统计**: 80 个 Kotlin 文件（约 30-40% 完成度）

---

## 🎯 核心功能需求

### 从鳄霸助手参考的功能
根据 android-project 分析，重点参考：

#### 1. **图像识别 & OCR** ✅ 进行中
- **现状**: ML Kit 已集成
- **参考**: 鳄霸助手的 OpenCV 4.8.0 实现
- **待办**:
  - [ ] 优化识别精度（参考 OpenCV 预处理）
  - [ ] 添加区域选择功能
  - [ ] 多语言支持（中文已有）
  - [ ] 识别结果缓存

#### 2. **自动化脚本引擎** ✅ 框架已有
- **现状**: Rhino JS Engine 已集成
- **参考**: 鳄霸助手的脚本系统
- **待办**:
  - [ ] 实现 JavaScript API 接口
  - [ ] 脚本编辑器界面
  - [ ] 脚本市场/导入导出
  - [ ] 脚本调试功能

#### 3. **UI 自动化** ⏳ 待开发
- **现状**: ViewModel 已创建
- **参考**: 鳄霸助手的 UI 操作
- **待办**:
  - [ ] 无障碍服务集成
  - [ ] 控件查找和操作
  - [ ] 手势模拟
  - [ ] 自动化流程录制

#### 4. **数据库 & 配置** ✅ 框架已有
- **现状**: Room Database 已配置
- **参考**: 鳄霸助手的 MySQL JDBC
- **待办**:
  - [ ] 定义数据模型（User, Config, Script, Log）
  - [ ] DAO 接口实现
  - [ ] 数据迁移策略
  - [ ] 云端同步（对接 818ys 后端）

#### 5. **后台服务** ✅ 框架已有
- **现状**: WorkManager 已集成
- **参考**: 鳄霸助手的后台机制
- **待办**:
  - [ ] 定时任务
  - [ ] 常驻服务
  - [ ] 自启动管理
  - [ ] 通知管理

#### 6. **网络通信** ⏳ 待集成
- **现状**: 未添加依赖
- **参考**: 鳄霸助手的 Retrofit + OkHttp
- **待办**:
  - [ ] 添加 Retrofit 依赖
  - [ ] 对接 818ys 后端 API
  - [ ] 用户认证（卡密/登录）
  - [ ] 版本更新检查

---

## 🗂️ 架构设计

### 分层架构
```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│  (Jetpack Compose UI + ViewModel)   │
├─────────────────────────────────────┤
│          Domain Layer               │
│    (Business Logic + Use Cases)     │
├─────────────────────────────────────┤
│           Data Layer                │
│  (Repository + Room + Retrofit)     │
├─────────────────────────────────────┤
│        Core Services                │
│ (OCR, Automation, Script Engine)    │
└─────────────────────────────────────┘
```

### 目录结构设计
```
app/src/main/java/com/ys818/supkit/
├── data/                 # 数据层
│   ├── local/           # Room Database
│   │   ├── dao/
│   │   ├── entity/
│   │   └── database/
│   ├── remote/          # Retrofit API
│   │   ├── api/
│   │   ├── dto/
│   │   └── interceptor/
│   └── repository/      # 数据仓库
│
├── domain/              # 业务层
│   ├── model/          # 业务模型
│   ├── usecase/        # 用例
│   └── repository/     # 仓库接口
│
├── ui/                  # 展示层 ✅ 已有
│   ├── home/
│   ├── ocr/
│   ├── automation/
│   ├── script/
│   ├── settings/
│   └── ...
│
├── service/             # 核心服务
│   ├── ocr/            # OCR 引擎
│   ├── automation/     # 自动化服务
│   ├── script/         # 脚本引擎
│   └── accessibility/  # 无障碍服务
│
├── util/                # 工具类
│   ├── ImageUtil
│   ├── FileUtil
│   ├── PermissionUtil
│   └── LogUtil
│
└── di/                  # 依赖注入 (待添加 Hilt)
```

---

## 📋 开发路线图

### 第一阶段：核心服务完善（2周）

#### Week 1: 数据层 + 网络层
- [ ] **Day 1-2**: Room Database 实体和 DAO
  ```kotlin
  // 实体设计
  @Entity(tableName = "users")
  data class User(
      @PrimaryKey val id: Long,
      val username: String,
      val token: String,
      val vipExpireAt: Long
  )
  
  @Entity(tableName = "scripts")
  data class Script(
      @PrimaryKey(autoGenerate = true) val id: Long,
      val name: String,
      val code: String,
      val createdAt: Long
  )
  ```

- [ ] **Day 3-4**: Retrofit API 集成
  ```kotlin
  // API 接口
  interface YsApiService {
      @POST("auth/login")
      suspend fun login(@Body req: LoginRequest): ApiResponse<LoginData>
      
      @GET("user/info")
      suspend fun getUserInfo(): ApiResponse<UserInfo>
      
      @GET("script/list")
      suspend fun getScriptList(): ApiResponse<List<ScriptInfo>>
  }
  ```

- [ ] **Day 5**: Repository 实现
  ```kotlin
  class UserRepository(
      private val api: YsApiService,
      private val dao: UserDao
  ) {
      suspend fun login(username: String, password: String) {
          val response = api.login(LoginRequest(username, password))
          dao.insert(response.data.toEntity())
      }
  }
  ```

#### Week 2: 自动化引擎
- [ ] **Day 1-2**: 无障碍服务框架
  ```kotlin
  class YsAccessibilityService : AccessibilityService() {
      override fun onAccessibilityEvent(event: AccessibilityEvent) {
          // 处理 UI 事件
      }
      
      fun clickNode(text: String): Boolean {
          // 点击指定文本的控件
      }
  }
  ```

- [ ] **Day 3-4**: 脚本引擎 API
  ```kotlin
  class ScriptEngine {
      fun executeScript(code: String) {
          val rhino = Context.enter()
          val scope = rhino.initStandardObjects()
          
          // 注入 Android API
          ScriptableObject.putProperty(scope, "ocr", OcrApi())
          ScriptableObject.putProperty(scope, "click", ClickApi())
          
          rhino.evaluateString(scope, code, "script", 1, null)
      }
  }
  ```

- [ ] **Day 5-7**: OCR 优化
  - 图像预处理（参考 OpenCV）
  - 识别精度调优
  - 结果缓存机制

---

### 第二阶段：业务功能（2周）

#### Week 3: 核心业务
- [ ] **Day 1-2**: 用户认证系统
  - 登录/注册界面
  - Token 管理
  - VIP 状态检查

- [ ] **Day 3-4**: 脚本管理
  - 脚本编辑器界面
  - 本地脚本库
  - 云端脚本同步

- [ ] **Day 5-7**: 自动化流程
  - 任务创建和管理
  - 定时执行
  - 执行日志

#### Week 4: 辅助功能
- [ ] **Day 1-2**: 诊断工具
  - 设备信息
  - 性能监控
  - 权限检查

- [ ] **Day 3-4**: 设置中心
  - 主题切换
  - 通知设置
  - 缓存管理

- [ ] **Day 5-7**: 测试和优化
  - 单元测试
  - UI 测试
  - 性能优化

---

### 第三阶段：打磨和发布（1周）

#### Week 5: 发布准备
- [ ] **Day 1-2**: 功能测试
  - 完整流程测试
  - 边界条件测试
  - 兼容性测试

- [ ] **Day 3-4**: 性能优化
  - 内存优化
  - 电池优化
  - 启动速度

- [ ] **Day 5**: 打包发布
  - ProGuard 混淆
  - 签名打包
  - 版本发布

---

## 🔑 关键技术点

### 1. OCR 优化（参考 OpenCV）
```kotlin
// 图像预处理流程
fun preprocessImage(bitmap: Bitmap): Bitmap {
    // 1. 灰度化
    val gray = toGrayscale(bitmap)
    
    // 2. 二值化（自适应阈值）
    val binary = adaptiveThreshold(gray)
    
    // 3. 去噪
    val denoised = medianBlur(binary, 3)
    
    // 4. 倾斜校正
    val corrected = deskew(denoised)
    
    return corrected
}
```

### 2. 脚本 API 设计
```javascript
// 用户脚本示例
const result = ocr.recognize(100, 200, 300, 400); // 识别区域
if (result.includes("开始游戏")) {
    click.tap(200, 500); // 点击按钮
    sleep(1000);
}
```

### 3. 无障碍服务核心
```kotlin
class AutomationService : AccessibilityService() {
    fun findNodeByText(text: String): AccessibilityNodeInfo? {
        return rootInActiveWindow?.findAccessibilityNodeInfosByText(text)?.firstOrNull()
    }
    
    fun performClick(node: AccessibilityNodeInfo): Boolean {
        return node.performAction(AccessibilityNodeInfo.ACTION_CLICK)
    }
}
```

---

## 📦 依赖补充

### 需要添加的库
```gradle
dependencies {
    // 网络请求
    implementation 'com.squareup.retrofit2:retrofit:2.9.0'
    implementation 'com.squareup.retrofit2:converter-gson:2.9.0'
    implementation 'com.squareup.okhttp3:okhttp:4.12.0'
    implementation 'com.squareup.okhttp3:logging-interceptor:4.12.0'
    
    // 依赖注入
    implementation 'com.google.dagger:hilt-android:2.51'
    ksp 'com.google.dagger:hilt-compiler:2.51'
    
    // 图片处理（可选，如果需要 OpenCV 级别的处理）
    implementation 'org.opencv:opencv:4.8.0'
    
    // 权限请求
    implementation 'com.google.accompanist:accompanist-permissions:0.32.0'
    
    // 日志
    implementation 'com.jakewharton.timber:timber:5.0.1'
}
```

---

## 🎯 与 818ys 后端对接

### API 端点设计
```kotlin
// 基础 URL
const val BASE_URL = "https://api.818ys.com/v1/"

// 用户认证
POST /auth/login          // 登录
POST /auth/register       // 注册
POST /auth/refresh        // 刷新 Token

// 用户信息
GET  /user/info           // 获取用户信息
GET  /user/vip/status     // VIP 状态

// 脚本市场
GET  /script/list         // 脚本列表
GET  /script/:id          // 脚本详情
POST /script/upload       // 上传脚本
GET  /script/my           // 我的脚本

// 自动化任务
GET  /task/list           // 任务列表
POST /task/create         // 创建任务
PUT  /task/:id/execute    // 执行任务
GET  /task/:id/logs       // 任务日志

// 系统
GET  /system/version      // 版本检查
GET  /system/notice       // 公告
```

---

## ⚠️ 风险和注意事项

### 技术风险
1. **无障碍服务稳定性**
   - 不同厂商 ROM 兼容性问题
   - 系统更新可能导致 API 变化
   - **缓解**: 多设备测试，添加降级方案

2. **OCR 识别精度**
   - 不同游戏界面差异大
   - 光照、角度影响识别
   - **缓解**: 图像预处理，用户可调参数

3. **性能和电量**
   - 后台服务耗电
   - OCR 计算密集
   - **缓解**: 优化算法，可配置扫描频率

### 合规风险
1. **Google Play 政策**
   - 无障碍服务审核严格
   - 自动化工具可能被拒
   - **缓解**: 强调辅助功能，添加免责声明

2. **游戏厂商 ToS**
   - 自动化可能违反服务条款
   - **缓解**: 用户协议声明责任

---

## 📊 进度追踪

### 功能完成度
```
总体进度: ████░░░░░░ 30%

├─ UI 层:          ████████░░ 70% (基础框架完成)
├─ ViewModel:      ██████░░░░ 60% (骨架完成)
├─ 数据层:         ░░░░░░░░░░  0% (待开发)
├─ 网络层:         ░░░░░░░░░░  0% (待开发)
├─ OCR 引擎:       ████░░░░░░ 40% (集成完成，待优化)
├─ 脚本引擎:       ██░░░░░░░░ 20% (依赖已加，待实现)
├─ 自动化服务:     ██░░░░░░░░ 20% (ViewModel 已有)
└─ 测试:           ░░░░░░░░░░  0% (待开发)
```

### 时间估算
- **当前状态**: 基础框架 (~30%)
- **剩余工作**: ~3-4 周全职开发
- **可交付版本**: 
  - MVP (基础功能): 2 周
  - 完整版 (全功能): 4 周
  - 优化版 (打磨): 5 周

---

## 🚀 立即可做的任务

### 优先级排序
1. 🔴 **P0 - 数据层搭建** (3-4 天)
   - Room 实体和 DAO
   - Repository 模式
   - 本地数据持久化

2. 🔴 **P0 - 网络层集成** (2-3 天)
   - Retrofit 配置
   - API 接口定义
   - 错误处理

3. 🟡 **P1 - OCR 优化** (2-3 天)
   - 图像预处理
   - 识别精度提升
   - 结果缓存

4. 🟡 **P1 - 脚本引擎实现** (3-4 天)
   - JavaScript API
   - 脚本编辑器
   - 执行调试

5. 🟢 **P2 - 自动化服务** (4-5 天)
   - 无障碍服务
   - UI 操作 API
   - 流程录制

---

## 📝 TODO List

### 本周待办（Week 1）
- [ ] **Day 1**: 创建 Room Database 实体
  - User, Script, Task, Log 实体
  - 定义表关系
  
- [ ] **Day 2**: 实现 DAO 接口
  - UserDao, ScriptDao, TaskDao
  - 查询方法定义
  
- [ ] **Day 3**: 配置 Retrofit
  - 添加依赖
  - 创建 API Service
  - 配置拦截器（Token、日志）
  
- [ ] **Day 4**: 实现 Repository
  - UserRepository
  - ScriptRepository
  - 错误处理

- [ ] **Day 5**: 连接 UI 层
  - 更新 ViewModel 使用 Repository
  - 测试数据流
  
### 下周待办（Week 2）
- [ ] OCR 图像预处理
- [ ] 脚本引擎 API 设计
- [ ] 无障碍服务框架

---

## 🎓 参考资料

### 从 android-project 学习
1. **OpenCV 图像处理**
   - 文件: `opencv-4.8.0.aar`
   - 学习: 图像预处理算法

2. **混淆和安全**
   - 文件: `proguard-rules.pro`
   - 学习: 代码保护策略

3. **网络架构**
   - 库: Retrofit + OkHttp
   - 学习: API 设计模式

### Android 官方文档
- [Jetpack Compose](https://developer.android.com/jetpack/compose)
- [Room Database](https://developer.android.com/training/data-storage/room)
- [Accessibility Service](https://developer.android.com/guide/topics/ui/accessibility/service)
- [ML Kit Text Recognition](https://developers.google.com/ml-kit/vision/text-recognition)

---

## 💡 关键决策点

### 需要确认的问题
1. **后端 API 文档在哪里？**
   - 需要接口文档才能实现网络层
   
2. **用户认证方式？**
   - 卡密验证？
   - 账号密码？
   - OAuth？
   
3. **脚本分发策略？**
   - 云端脚本市场？
   - 本地导入？
   - 两者都有？
   
4. **目标游戏列表？**
   - 主要支持哪些游戏？
   - 每个游戏的特定需求？

---

## 📞 协作需求

### 需要其他团队支持
1. **后端团队**
   - 提供 API 文档
   - 开发测试环境
   - WebSocket 支持（如需实时通信）

2. **产品团队**
   - 功能优先级
   - UI/UX 设计稿
   - 用户反馈

3. **测试团队**
   - 测试设备（多品牌 Android）
   - 测试用例
   - Bug 报告流程

---

## 🎉 总结

### 当前状态
✅ **基础框架已搭建完成**
- Modern UI (Jetpack Compose)
- MVVM 架构
- 核心依赖已集成

⏳ **待完成核心功能**
- 数据层和网络层
- 业务逻辑实现
- 与后端对接

### 预期交付
- **2 周后**: MVP 版本（基础 OCR + 脚本）
- **4 周后**: 完整版本（全功能）
- **5 周后**: 优化版本（打磨 + 测试）

### 关键成功因素
1. 后端 API 及时对接
2. 充足的测试设备
3. 产品需求明确
4. 技术难点及时解决

---

**立即开始第一步：创建 Room Database 实体！** 🚀

需要我立即开始编写 Room 实体代码吗？
