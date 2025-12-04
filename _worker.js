export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // ====== 自定义配置开始 ======
    const TARGET = "https://raw.githubusercontent.com/hafrey1/LunaTV-config/main/index.json";
    // ====== 自定义配置结束 ======

    // 根路径 → 提供配置文件
    if (url.pathname === "/" || url.pathname === "/index.json") {
      return fetch(TARGET, {
        headers: { "User-Agent": "Cloudflare-Worker" }
      });
    }

    // 动态代理: /proxy/xxx.com/abc
    if (url.pathname.startsWith("/proxy/")) {
      const realUrl = url.pathname.replace("/proxy/", "");
      try {
        return await fetch("https://" + realUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0"
          }
        });
      } catch (e) {
        return new Response("Proxy error: " + e.message, { status: 500 });
      }
    }

    // 默认返回说明
    return new Response(
      JSON.stringify({
        status: "ok",
        message: "Cloudflare Worker is running.",
        usage: {
          "/": "返回默认 LunaTV 配置源",
          "/index.json": "等同于 /",
          "/proxy/xxxx.com/path": "可选代理模式"
        }
      }, null, 2),
      {
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};
