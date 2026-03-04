# SPEC - [T2] 小程序多服务器切换配置

## [T2] 小程序韩服/山海服切换与配置

**目标**：支持小程序用户在中国服、韩国服、山海服之间切换，并通过管理后台动态配置可用服务器

**业务规则**：
- 小程序导航栏支持 CN（中国服）、KR（韩国服）、SHANHAI（山海服）切换
- 服务器配置通过管理后台 `data_dict` 表统一管理
- 山海服对应后端枚举 `GameServer.SHANHAI` 和 `GameSubServer.S`
- 服务器切换后，房间列表、创建房间等功能自动适配对应服务器

**涉及端**：
- [x] 后端 API（枚举扩展）
- [x] 管理后台（`data_dict` 配置）
- [x] 小程序（导航组件 + 服务器配置逻辑）

**BDD 场景**：
| Given（前置条件） | When（操作） | Then（预期结果） |
|------------------|-------------|-----------------|
| 用户打开小程序 | 查看导航栏 | 显示 CN / KR / SHANHAI 三个选项（根据配置） |
| 用户选择"山海" | 点击切换按钮 | 导航栏高亮山海，房间列表切换到山海服数据 |
| 管理员在后台禁用韩服 | 修改 `data_dict` 配置 | 小程序导航栏不显示 KR 选项 |
| 用户创建房间 | 选择山海服并创建房间 | 房间的 `game_server` 字段为 SHANHAI |

**技术约束**：
- 服务器枚举需与后端 `GameServer` / `GameSubServer` 严格对齐
- 小程序需支持动态加载服务器配置（从 API 获取）

**后端变更**：
```java
// GameServer.java
public enum GameServer {
    CN("中国服"),
    KR("韩国服"),
    SHANHAI("山海服"); // 新增
}

// GameSubServer.java
public enum GameSubServer {
    A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R,
    S; // 新增，对应山海服
}
```

**小程序变更**：
```typescript
// custom-nav.ts
const serverOptions = [
  { value: 'CN', label: '中国服' },
  { value: 'KR', label: '韩国服' },
  { value: 'SHANHAI', label: '山海' } // 新增
];

// server.config.ts
export const SERVER_CONFIG = {
  CN: { name: '中国服', subServers: ['A', 'B', ...] },
  KR: { name: '韩国服', subServers: ['A', 'B', ...] },
  SHANHAI: { name: '山海服', subServers: ['S'] } // 新增
};
```

**合并策略**：
- [x] 手动合并

**实际完成情况**：
- ✅ 后端枚举已扩展（`GameServer.SHANHAI` + `GameSubServer.S`）
- ✅ 小程序 `custom-nav` 组件已支持三服切换
- ✅ 服务器配置逻辑已实现（`server.config.ts`）
- ✅ 管理后台 `data_dict` 配置支持（`AppConfigList.vue`）
- ✅ CI 验证通过
- ⏳ PR #153 已创建，等待合并

**复盘记录**：
- 开发耗时：约 1.5 小时
- 主要挑战：三端枚举值一致性校验
- 优化建议：建立枚举值跨端同步检查机制
