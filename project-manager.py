#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
818 项目管理工具 - 主控制台
Project Management Tool for 818 Ecosystem
"""

import os
import sys
import json
from datetime import datetime
from pathlib import Path

# 项目配置
WORKSPACE = Path("/Users/dresing/.openclaw/workspace")
PROJECTS_DIR = Path("/Users/dresing/projects")
CONFIG_FILE = WORKSPACE / "project-config.json"

# 颜色输出
class Colors:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    END = '\033[0m'
    BOLD = '\033[1m'

def print_header(text):
    print(f"\n{Colors.BOLD}{Colors.CYAN}{'=' * 60}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.CYAN}{text:^60}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.CYAN}{'=' * 60}{Colors.END}\n")

def print_success(text):
    print(f"{Colors.GREEN}✓{Colors.END} {text}")

def print_error(text):
    print(f"{Colors.RED}✗{Colors.END} {text}")

def print_warning(text):
    print(f"{Colors.YELLOW}⚠{Colors.END} {text}")

def print_info(text):
    print(f"{Colors.BLUE}ℹ{Colors.END} {text}")

# 项目定义
PROJECTS = {
    "818ys": {
        "name": "818勇士助手后端",
        "path": PROJECTS_DIR / "818ys",
        "type": "backend",
        "tech": "Java/Spring Boot",
        "status": "production",
        "priority": "P0"
    },
    "818ys-admin": {
        "name": "818勇士助手管理后台",
        "path": PROJECTS_DIR / "818ys-admin",
        "type": "admin",
        "tech": "待确认",
        "status": "production",
        "priority": "P0"
    },
    "818ys-app": {
        "name": "818勇士助手小程序",
        "path": PROJECTS_DIR / "818ys-app",
        "type": "miniapp",
        "tech": "微信小程序",
        "status": "production",
        "priority": "P0"
    },
    "818ys-sup": {
        "name": "818辅助工具(旧版)",
        "path": PROJECTS_DIR / "818ys-sup",
        "type": "android",
        "tech": "Android",
        "status": "maintenance",
        "priority": "P2"
    },
    "818ys-sup/android-project": {
        "name": "鳄霸助手学习样本",
        "path": PROJECTS_DIR / "818ys-sup" / "android-project",
        "type": "sample",
        "tech": "Android (反编译)",
        "status": "reference",
        "priority": "P1"
    },
    "818ys-sup-kit": {
        "name": "818辅助工具(重构版)",
        "path": PROJECTS_DIR / "818ys-sup-kit",
        "type": "android",
        "tech": "Android (优化)",
        "status": "development",
        "priority": "P1"
    },
    "ai-news-platform": {
        "name": "DNF资讯平台",
        "path": WORKSPACE / "ai-news-platform",
        "type": "web",
        "tech": "Next.js + TypeScript",
        "status": "development",
        "priority": "P1"
    }
}

def check_git_status(project_path):
    """检查 Git 状态"""
    import subprocess
    try:
        result = subprocess.run(
            ["git", "-C", str(project_path), "status", "--porcelain"],
            capture_output=True,
            text=True,
            timeout=5
        )
        if result.returncode == 0:
            lines = result.stdout.strip().split('\n')
            count = len([l for l in lines if l])
            return count if count > 0 else 0
        return None
    except:
        return None

def scan_all_projects():
    """扫描所有项目"""
    print_header("📊 项目扫描报告")
    
    results = []
    for proj_id, info in PROJECTS.items():
        path = info["path"]
        exists = path.exists()
        git_status = check_git_status(path) if exists else None
        
        result = {
            "id": proj_id,
            "name": info["name"],
            "exists": exists,
            "git_files": git_status,
            "type": info["type"],
            "status": info["status"],
            "priority": info["priority"]
        }
        results.append(result)
        
        # 打印结果
        status_icon = "✓" if exists else "✗"
        status_color = Colors.GREEN if exists else Colors.RED
        
        print(f"\n{status_color}{status_icon}{Colors.END} {Colors.BOLD}{info['name']}{Colors.END}")
        print(f"   路径: {path}")
        print(f"   类型: {info['type']} | 技术: {info['tech']}")
        print(f"   状态: {info['status']} | 优先级: {info['priority']}")
        
        if exists and git_status is not None:
            if git_status > 0:
                print_warning(f"   Git: {git_status} 个未提交文件")
            else:
                print_success(f"   Git: 干净")
        elif exists:
            print_info("   Git: 未初始化")
    
    return results

def show_task_board():
    """显示任务看板"""
    print_header("📋 任务看板")
    
    tasks = {
        "P0 - 紧急": [
            {"id": "T1", "name": "android-project Git 提交", "status": "进行中", "time": "5分钟"},
            {"id": "T9", "name": "检查 24h 未领取提现订单", "status": "等待", "time": "10分钟"},
            {"id": "T1", "name": "检查待处理申诉记录", "status": "等待", "time": "10分钟"},
        ],
        "P1 - 重要": [
            {"id": "T4", "name": "修复 AI 问答算法", "status": "待办", "time": "30分钟"},
            {"id": "T5", "name": "DNF 资讯平台完善", "status": "待办", "time": "5小时"},
            {"id": "T6", "name": "GitHub Actions 自动化", "status": "待办", "time": "3小时"},
        ],
        "P2 - 优化": [
            {"id": "T7", "name": "818 AI 增强", "status": "待办", "time": "10小时"},
            {"id": "T8", "name": "数据分析看板", "status": "待办", "time": "8小时"},
        ]
    }
    
    for priority, task_list in tasks.items():
        print(f"\n{Colors.BOLD}{priority}{Colors.END}")
        for task in task_list:
            status_icons = {
                "进行中": f"{Colors.YELLOW}⏳{Colors.END}",
                "等待": f"{Colors.RED}⏸{Colors.END}",
                "待办": f"{Colors.BLUE}📋{Colors.END}",
                "完成": f"{Colors.GREEN}✓{Colors.END}"
            }
            icon = status_icons.get(task["status"], "•")
            print(f"  {icon} [{task['id']}] {task['name']} ({task['time']}) - {task['status']}")

def main_menu():
    """主菜单"""
    while True:
        print_header("🎯 818 项目管理工具")
        
        print("1. 📊 扫描所有项目")
        print("2. 📋 查看任务看板")
        print("3. 🔧 Git 管理")
        print("4. 📝 生成报告")
        print("5. ⚙️  配置管理")
        print("0. 退出")
        
        choice = input(f"\n{Colors.CYAN}请选择:{Colors.END} ").strip()
        
        if choice == "1":
            scan_all_projects()
        elif choice == "2":
            show_task_board()
        elif choice == "3":
            print_info("Git 管理功能开发中...")
        elif choice == "4":
            print_info("报告生成功能开发中...")
        elif choice == "5":
            print_info("配置管理功能开发中...")
        elif choice == "0":
            print_success("再见！")
            break
        else:
            print_error("无效选择")
        
        input(f"\n{Colors.CYAN}按 Enter 继续...{Colors.END}")
        os.system('clear' if os.name != 'nt' else 'cls')

if __name__ == "__main__":
    try:
        main_menu()
    except KeyboardInterrupt:
        print(f"\n\n{Colors.YELLOW}操作已取消{Colors.END}")
        sys.exit(0)
