#!/usr/bin/env python3
"""
验证设计优化效果
"""

import asyncio
from playwright.async_api import async_playwright
import os

async def verify_improvements():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={'width': 1920, 'height': 1080})
        page = await context.new_page()
        
        print("🚀 验证设计优化效果...")
        
        # 清除缓存并加载页面
        await page.goto("file://" + os.path.abspath("index.html"), wait_until="networkidle")
        await page.wait_for_timeout(2000)
        
        # 验证Hero区域文字长度
        hero_text = await page.text_content('.hero-title')
        hero_subtitle = await page.text_content('.hero-subtitle')
        total_hero_text = len(hero_text) + len(hero_subtitle)
        
        print(f"✅ Hero区域标题: '{hero_text}'")
        print(f"✅ Hero区域副标题: '{hero_subtitle}'")
        print(f"✅ Hero区域总字符数: {total_hero_text} (目标: <150)")
        
        if total_hero_text <= 150:
            print("🎉 Hero区域内容密度优化成功！")
        else:
            print("⚠️ Hero区域仍需进一步精简")
        
        # 验证特性卡片文字长度
        feature_cards = await page.query_selector_all('.feature-card')
        print(f"\n📝 验证 {len(feature_cards)} 个特性卡片的内容密度:")
        
        all_optimized = True
        for i, card in enumerate(feature_cards, 1):
            card_text_length = len(await page.text_content(card))
            print(f"   特性卡片{i}: {card_text_length} 字符")
            if card_text_length > 200:
                all_optimized = False
        
        if all_optimized:
            print("🎉 所有特性卡片内容密度优化成功！")
        else:
            print("⚠️ 部分特性卡片仍需精简")
        
        # 验证按钮宽度一致性
        buttons = await page.query_selector_all('.apple-button')
        button_widths = []
        
        for button in buttons:
            width = await page.evaluate('(el) => el.offsetWidth', button)
            button_widths.append(width)
        
        unique_widths = len(set(button_widths))
        print(f"\n🔘 按钮宽度统计: {len(button_widths)} 个按钮，{unique_widths} 种不同宽度")
        print(f"   宽度分布: {set(button_widths)}")
        
        if unique_widths <= 2:
            print("🎉 按钮宽度一致性优化成功！")
        else:
            print("⚠️ 按钮宽度仍需统一")
        
        # 创建优化后的截图
        if not os.path.exists('screenshots_optimized'):
            os.makedirs('screenshots_optimized')
        
        await page.screenshot(path='screenshots_optimized/homepage_optimized.png', full_page=True)
        print("\n📸 已保存优化后截图: screenshots_optimized/homepage_optimized.png")
        
        await browser.close()
        
        print("\n🎨 设计优化验证完成！")

if __name__ == "__main__":
    asyncio.run(verify_improvements())