#!/bin/bash

# 临时存储上一次 IP 的文件
IP_FILE="$HOME/.last_public_ip"

# 获取当前公网 IP（通过外部服务）
CURRENT_IP=$(curl -s https://api.ipify.org)

# 检测路由器 WAN IP（从网络接口）
WAN_IP=$(ipconfig getifaddr en0 2>/dev/null)

# 函数：判断 IP 是否私网段
is_private_ip() {
    local ip=$1
    if [[ $ip =~ ^10\. ]] || [[ $ip =~ ^192\.168\. ]] || [[ $ip =~ ^172\.(1[6-9]|2[0-9]|3[0-1])\. ]] || [[ $ip =~ ^100\.6[4-9]\. ]]; then
        return 0  # 是私网
    else
        return 1  # 不是私网
    fi
}

echo "📡 当前公网出口 IP: $CURRENT_IP"

if [ -n "$WAN_IP" ]; then
    echo "🔌 本机 en0 IP: $WAN_IP"
    if is_private_ip "$WAN_IP"; then
        echo "❌ 你的路由器 WAN IP 属于内网段（CGNAT），没有公网 IP"
    else
        echo "✅ 你的路由器 WAN IP 看起来是公网地址"
    fi
else
    echo "⚠️ 无法获取本地网卡 IP（可能是 Wi-Fi 接口名不同）"
fi

# 判断是否动态公网 IP
if [ -f "$IP_FILE" ]; then
    LAST_IP=$(cat "$IP_FILE")
    if [ "$LAST_IP" != "$CURRENT_IP" ]; then
        echo "🔄 公网 IP 已变化（动态公网 IP）"
    else
        echo "🔒 公网 IP 与上次相同（可能是固定公网 IP）"
    fi
else
    echo "首次运行，记录当前 IP"
fi

echo "$CURRENT_IP" > "$IP_FILE"