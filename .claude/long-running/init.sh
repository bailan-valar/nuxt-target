#!/bin/bash

# ============================================================================
# nuxt-rich-book 环境初始化脚本
# 用途: 在每次 coding agent 会话开始时初始化开发环境
# ============================================================================

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# ============================================================================
# 1. 环境检查
# ============================================================================

log_info "开始环境检查..."

# 检查 Node.js
if ! command -v node &> /dev/null; then
    log_error "Node.js 未安装,请先安装 Node.js (推荐版本: 18.x 或 20.x)"
    exit 1
fi
NODE_VERSION=$(node -v)
log_success "Node.js 版本: $NODE_VERSION"

# 检查 npm
if ! command -v npm &> /dev/null; then
    log_error "npm 未安装"
    exit 1
fi
NPM_VERSION=$(npm -v)
log_success "npm 版本: $NPM_VERSION"

# 检查 PostgreSQL 连接
log_info "检查 PostgreSQL 连接..."
if ! command -v psql &> /dev/null; then
    log_warning "psql 命令未找到,跳过数据库连接测试"
else
    # 从 .env 文件读取数据库 URL
    if [ -f .env ]; then
        source .env
        if [ -n "$DATABASE_URL" ]; then
            # 简单的连接测试 (不实际连接,只检查格式)
            if [[ $DATABASE_URL =~ ^postgresql:// ]]; then
                log_success "数据库 URL 格式正确"
            else
                log_error "数据库 URL 格式错误: $DATABASE_URL"
                exit 1
            fi
        else
            log_error ".env 文件中未找到 DATABASE_URL"
            exit 1
        fi
    else
        log_error ".env 文件不存在"
        exit 1
    fi
fi

# ============================================================================
# 2. 依赖安装
# ============================================================================

log_info "检查 node_modules..."
if [ ! -d "node_modules" ]; then
    log_warning "node_modules 不存在,开始安装依赖..."
    npm install
    log_success "依赖安装完成"
else
    # 检查 package.json 是否比 node_modules 新
    if [ package.json -nt node_modules ]; then
        log_warning "package.json 已更新,重新安装依赖..."
        npm install
        log_success "依赖更新完成"
    else
        log_success "依赖已是最新"
    fi
fi

# ============================================================================
# 3. Prisma 初始化
# ============================================================================

log_info "初始化 Prisma..."

# 生成 Prisma Client
log_info "生成 Prisma Client..."
npm run generate
log_success "Prisma Client 生成完成"

# 检查数据库 schema 是否同步
log_info "检查数据库 schema..."
# 注意: prisma db push 会修改数据库,这里只做检查
# 实际同步由 Agent 在需要时手动执行
log_warning "请确保数据库 schema 已同步 (运行 npm run dbpush)"

# ============================================================================
# 4. 端口检查
# ============================================================================

log_info "检查端口 3000 占用情况..."

# Windows 环境
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    PORT_PID=$(netstat -ano | grep ":3000" | grep "LISTENING" | awk '{print $5}' | head -1)
    if [ -n "$PORT_PID" ]; then
        log_warning "端口 3000 被进程 $PORT_PID 占用"
        read -p "是否终止该进程? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            taskkill //PID $PORT_PID //F
            log_success "进程已终止"
        else
            log_warning "请手动终止进程或使用其他端口"
        fi
    else
        log_success "端口 3000 可用"
    fi
# Unix/Linux/Mac 环境
else
    PORT_PID=$(lsof -ti:3000 2>/dev/null || true)
    if [ -n "$PORT_PID" ]; then
        log_warning "端口 3000 被进程 $PORT_PID 占用"
        read -p "是否终止该进程? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            kill -9 $PORT_PID
            log_success "进程已终止"
        else
            log_warning "请手动终止进程或使用其他端口"
        fi
    else
        log_success "端口 3000 可用"
    fi
fi

# ============================================================================
# 5. 启动开发服务器
# ============================================================================

log_info "准备启动开发服务器..."
log_warning "⚠️  开发服务器将绑定到 0.0.0.0,可能暴露在网络上"
log_info "命令: npm run dev"
log_info ""
log_info "请在另一个终端窗口运行以下命令启动服务器:"
log_info "  cd $(pwd)"
log_info "  npm run dev"
log_info ""
log_warning "注意: 不要在此脚本中自动启动服务器,因为它会阻塞 Agent 执行"

# ============================================================================
# 6. 环境信息摘要
# ============================================================================

echo ""
log_info "=========================================="
log_info "环境初始化完成!"
log_info "=========================================="
echo ""
log_info "项目路径: $(pwd)"
log_info "Node.js: $NODE_VERSION"
log_info "npm: $NPM_VERSION"
log_info "数据库: $DATABASE_URL"
log_info ""
log_info "下一步:"
log_info "  1. 在新终端运行: npm run dev"
log_info "  2. 访问: http://localhost:3000"
log_info "  3. Prisma Studio: npm run studio (端口 5555)"
log_info ""
log_success "可以开始编码了! 🚀"
echo ""

exit 0
