#!/usr/bin/env python3
"""
Visual Design Analysis for www.godscode.com.cn
从最苛刻用户的艺术审美角度分析页面设计
"""

import asyncio
import time
from playwright.async_api import async_playwright
import sys
import os

class VisualDesignAnalysis:
    def __init__(self):
        self.base_url = "https://www.godscode.com.cn"
        self.screenshots_dir = "screenshots"
        self.design_issues = []
        
    def setup_screenshots_dir(self):
        """创建截图目录"""
        if not os.path.exists(self.screenshots_dir):
            os.makedirs(self.screenshots_dir)
    
    def log_design_issue(self, category, severity, description, suggestion=""):
        """记录设计问题"""
        self.design_issues.append({
            'category': category,
            'severity': severity,  # critical, major, minor
            'description': description,
            'suggestion': suggestion
        })
        
        severity_icon = {"critical": "🔴", "major": "🟡", "minor": "🟢"}
        print(f"{severity_icon[severity]} [{category}] {description}")
        if suggestion:
            print(f"   💡 建议: {suggestion}")
    
    async def take_full_page_screenshot(self, page, filename):
        """截取全页面截图"""
        await page.screenshot(
            path=f"{self.screenshots_dir}/{filename}",
            full_page=True
        )
        print(f"📸 已保存截图: {filename}")
    
    async def analyze_visual_hierarchy(self, page):
        """分析视觉层次结构"""
        print("\n🎨 分析视觉层次结构...")
        
        # 截取全页面截图
        await self.take_full_page_screenshot(page, "homepage_full.png")
        
        # 检查标题层次
        headings = await page.query_selector_all('h1, h2, h3, h4, h5, h6')
        font_sizes = []
        
        for heading in headings:
            computed_style = await page.evaluate('''
                (element) => {
                    const style = window.getComputedStyle(element);
                    return {
                        fontSize: style.fontSize,
                        fontWeight: style.fontWeight,
                        lineHeight: style.lineHeight,
                        marginBottom: style.marginBottom,
                        tag: element.tagName.toLowerCase()
                    };
                }
            ''', heading)
            font_sizes.append(computed_style)
        
        # 分析标题尺寸递减逻辑
        h1_size = next((fs for fs in font_sizes if fs['tag'] == 'h1'), None)
        h2_size = next((fs for fs in font_sizes if fs['tag'] == 'h2'), None)
        h3_size = next((fs for fs in font_sizes if fs['tag'] == 'h3'), None)
        
        if h1_size and h2_size:
            h1_px = float(h1_size['fontSize'].replace('px', ''))
            h2_px = float(h2_size['fontSize'].replace('px', ''))
            
            if h1_px <= h2_px:
                self.log_design_issue(
                    "视觉层次",
                    "major",
                    f"H1标题字号({h1_px}px)不够突出，应大于H2({h2_px}px)",
                    "将H1字号增大至少20%，建立清晰的视觉层次"
                )
        
        print(f"   ✓ 发现 {len(headings)} 个标题元素")
        return font_sizes
    
    async def analyze_spacing_consistency(self, page):
        """分析间距一致性"""
        print("\n📏 分析间距一致性...")
        
        # 检查各个section之间的间距
        sections = await page.query_selector_all('section')
        section_margins = []
        
        for section in sections:
            margin_info = await page.evaluate('''
                (element) => {
                    const style = window.getComputedStyle(element);
                    const rect = element.getBoundingClientRect();
                    return {
                        marginTop: style.marginTop,
                        marginBottom: style.marginBottom,
                        paddingTop: style.paddingTop,
                        paddingBottom: style.paddingBottom,
                        className: element.className,
                        height: rect.height
                    };
                }
            ''', section)
            section_margins.append(margin_info)
        
        # 检查卡片间距
        cards = await page.query_selector_all('.feature-card, .solution-card, .case-card')
        card_gaps = []
        
        for card in cards:
            gap_info = await page.evaluate('''
                (element) => {
                    const style = window.getComputedStyle(element);
                    const rect = element.getBoundingClientRect();
                    return {
                        margin: style.margin,
                        padding: style.padding,
                        width: rect.width,
                        height: rect.height,
                        className: element.className
                    };
                }
            ''', card)
            card_gaps.append(gap_info)
        
        # 分析间距规律性
        paddings = [float(info['paddingTop'].replace('px', '')) for info in section_margins if info['paddingTop'] != 'auto']
        if len(set(paddings)) > 3:
            self.log_design_issue(
                "间距一致性",
                "major", 
                f"发现{len(set(paddings))}种不同的section间距，缺乏统一性",
                "建立8px网格系统，使用16px、24px、32px、48px等规范间距"
            )
        
        print(f"   ✓ 分析了 {len(sections)} 个section和 {len(cards)} 个卡片的间距")
    
    async def analyze_color_harmony(self, page):
        """分析色彩和谐度"""
        print("\n🎨 分析色彩搭配...")
        
        # 获取页面主要颜色
        color_analysis = await page.evaluate('''
            () => {
                const colors = new Set();
                const elements = document.querySelectorAll('*');
                
                elements.forEach(el => {
                    const style = window.getComputedStyle(el);
                    const bgColor = style.backgroundColor;
                    const textColor = style.color;
                    const borderColor = style.borderColor;
                    
                    if (bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
                        colors.add(bgColor);
                    }
                    if (textColor !== 'rgba(0, 0, 0, 0)') {
                        colors.add(textColor);
                    }
                    if (borderColor !== 'rgba(0, 0, 0, 0)') {
                        colors.add(borderColor);
                    }
                });
                
                return Array.from(colors).slice(0, 20); // 取前20个主要颜色
            }
        ''')
        
        # 检查蓝色系统的使用
        blue_variants = [color for color in color_analysis if 'rgb(0, 122, 255)' in color or 'rgb(0, 81' in color]
        
        if len(color_analysis) > 12:
            self.log_design_issue(
                "色彩系统",
                "minor",
                f"页面使用了{len(color_analysis)}种颜色，可能过于复杂",
                "简化色彩方案，主要使用2-3种主色调和对应的灰度系统"
            )
        
        print(f"   ✓ 发现 {len(color_analysis)} 种主要颜色")
        print(f"   ✓ 蓝色系统变体: {len(blue_variants)} 种")
    
    async def analyze_content_density(self, page):
        """分析内容密度和留白"""
        print("\n📝 分析内容密度...")
        
        # 截取Hero区域
        hero_section = await page.query_selector('.apple-hero')
        if hero_section:
            await hero_section.screenshot(path=f"{self.screenshots_dir}/hero_section.png")
            
            # 分析Hero区域的内容量
            hero_text_length = await page.evaluate('''
                () => {
                    const hero = document.querySelector('.apple-hero');
                    return hero ? hero.textContent.length : 0;
                }
            ''')
            
            if hero_text_length > 200:
                self.log_design_issue(
                    "内容密度",
                    "minor",
                    f"Hero区域文字过多({hero_text_length}字符)，可能影响视觉冲击",
                    "精简文案，突出核心价值主张，建议控制在150字符内"
                )
        
        # 截取特性区域
        features_section = await page.query_selector('.apple-features')
        if features_section:
            await features_section.screenshot(path=f"{self.screenshots_dir}/features_section.png")
        
        # 检查特性卡片内容长度
        feature_cards = await page.query_selector_all('.feature-card')
        for i, card in enumerate(feature_cards):
            card_text_length = await page.evaluate('(el) => el.textContent.length', card)
            if card_text_length > 300:
                self.log_design_issue(
                    "内容密度",
                    "minor",
                    f"特性卡片{i+1}文字过多({card_text_length}字符)",
                    "每个特性卡片文字建议控制在200字符内，突出关键信息"
                )
    
    async def analyze_visual_balance(self, page):
        """分析视觉平衡"""
        print("\n⚖️ 分析视觉平衡...")
        
        # 分析图片与文字的比例
        images = await page.query_selector_all('img')
        image_areas = []
        
        for img in images:
            img_info = await page.evaluate('''
                (element) => {
                    const rect = element.getBoundingClientRect();
                    return {
                        width: rect.width,
                        height: rect.height,
                        area: rect.width * rect.height,
                        visible: rect.width > 0 && rect.height > 0
                    };
                }
            ''', img)
            if img_info['visible']:
                image_areas.append(img_info['area'])
        
        total_image_area = sum(image_areas)
        
        # 获取页面总面积
        page_info = await page.evaluate('''
            () => {
                return {
                    width: document.documentElement.scrollWidth,
                    height: document.documentElement.scrollHeight
                };
            }
        ''')
        
        total_page_area = page_info['width'] * page_info['height']
        image_ratio = total_image_area / total_page_area if total_page_area > 0 else 0
        
        if image_ratio < 0.1:
            self.log_design_issue(
                "视觉平衡",
                "major",
                f"图片占比过低({image_ratio:.1%})，页面可能过于文字化",
                "增加视觉元素，如插图、图标或装饰性元素，提升视觉吸引力"
            )
        elif image_ratio > 0.4:
            self.log_design_issue(
                "视觉平衡",
                "minor",
                f"图片占比较高({image_ratio:.1%})，注意保持内容重点",
                "适当平衡图文比例，确保核心信息突出"
            )
        
        print(f"   ✓ 图片视觉占比: {image_ratio:.1%}")
    
    async def analyze_alignment_consistency(self, page):
        """分析对齐一致性"""
        print("\n📐 分析对齐一致性...")
        
        # 检查标题对齐
        titles = await page.query_selector_all('h1, h2, h3')
        alignments = []
        
        for title in titles:
            alignment = await page.evaluate('''
                (element) => {
                    const style = window.getComputedStyle(element);
                    return {
                        textAlign: style.textAlign,
                        margin: style.margin,
                        tag: element.tagName.toLowerCase()
                    };
                }
            ''', title)
            alignments.append(alignment)
        
        # 检查按钮对齐
        buttons = await page.query_selector_all('.apple-button')
        button_positions = []
        
        for button in buttons:
            position = await page.evaluate('''
                (element) => {
                    const rect = element.getBoundingClientRect();
                    const parent = element.parentElement;
                    const parentRect = parent.getBoundingClientRect();
                    return {
                        left: rect.left - parentRect.left,
                        centerX: rect.left + rect.width / 2 - parentRect.left,
                        width: rect.width
                    };
                }
            ''', button)
            button_positions.append(position)
        
        # 分析按钮宽度一致性
        button_widths = [pos['width'] for pos in button_positions]
        if len(set(button_widths)) > 2:
            self.log_design_issue(
                "对齐一致性",
                "minor",
                f"按钮宽度不一致，发现{len(set(button_widths))}种不同宽度",
                "统一按钮最小宽度，保持视觉节奏感"
            )
        
        print(f"   ✓ 检查了 {len(titles)} 个标题和 {len(buttons)} 个按钮的对齐")
    
    async def analyze_mobile_responsiveness(self, page):
        """分析移动端响应式设计"""
        print("\n📱 分析移动端响应式设计...")
        
        # 测试不同屏幕尺寸
        viewports = [
            {"width": 375, "height": 667, "name": "mobile"},
            {"width": 768, "height": 1024, "name": "tablet"},
            {"width": 1920, "height": 1080, "name": "desktop"}
        ]
        
        for viewport in viewports:
            await page.set_viewport_size({"width": viewport["width"], "height": viewport["height"]})
            await page.wait_for_timeout(1000)
            
            # 截图保存
            await self.take_full_page_screenshot(page, f"homepage_{viewport['name']}.png")
            
            # 检查内容是否溢出
            overflow_check = await page.evaluate('''
                () => {
                    const body = document.body;
                    const hasHorizontalScroll = body.scrollWidth > window.innerWidth;
                    return {
                        hasOverflow: hasHorizontalScroll,
                        bodyWidth: body.scrollWidth,
                        windowWidth: window.innerWidth
                    };
                }
            ''')
            
            if overflow_check['hasOverflow']:
                self.log_design_issue(
                    "响应式设计",
                    "major",
                    f"{viewport['name']}端出现水平滚动条",
                    "检查并修复导致水平溢出的元素"
                )
        
        # 恢复桌面视口
        await page.set_viewport_size({"width": 1920, "height": 1080})
    
    async def generate_design_recommendations(self):
        """生成设计优化建议"""
        print("\n" + "="*60)
        print("🎨 设计分析报告 - 最苛刻用户视角")
        print("="*60)
        
        if not self.design_issues:
            print("🎉 页面设计完美！未发现明显问题。")
            return
        
        # 按严重程度分类
        critical_issues = [issue for issue in self.design_issues if issue['severity'] == 'critical']
        major_issues = [issue for issue in self.design_issues if issue['severity'] == 'major']
        minor_issues = [issue for issue in self.design_issues if issue['severity'] == 'minor']
        
        print(f"🔴 严重问题: {len(critical_issues)}")
        print(f"🟡 主要问题: {len(major_issues)}")
        print(f"🟢 次要问题: {len(minor_issues)}")
        
        print("\n📋 优先级修复建议:")
        
        all_issues = critical_issues + major_issues + minor_issues
        for i, issue in enumerate(all_issues, 1):
            print(f"\n{i}. [{issue['category']}] {issue['description']}")
            if issue['suggestion']:
                print(f"   💡 {issue['suggestion']}")
        
        print(f"\n📁 截图已保存到 {self.screenshots_dir}/ 目录")
        print("   - homepage_full.png: 完整页面截图")
        print("   - homepage_mobile.png: 移动端截图")
        print("   - homepage_tablet.png: 平板端截图") 
        print("   - homepage_desktop.png: 桌面端截图")
        print("   - hero_section.png: Hero区域截图")
        print("   - features_section.png: 特性区域截图")
    
    async def run_visual_analysis(self):
        """运行完整的视觉设计分析"""
        self.setup_screenshots_dir()
        
        async with async_playwright() as p:
            print("🎨 启动视觉设计分析...")
            print("👁️  以最苛刻用户的艺术眼光审视页面...")
            print("="*60)
            
            try:
                browser = await p.chromium.launch(headless=True)
                context = await browser.new_context(
                    viewport={'width': 1920, 'height': 1080},
                    user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
                )
                page = await context.new_page()
                
                # 访问页面
                await page.goto(self.base_url, wait_until="networkidle", timeout=30000)
                await page.wait_for_timeout(2000)  # 等待动画完成
                
                # 执行各项视觉分析
                await self.analyze_visual_hierarchy(page)
                await self.analyze_spacing_consistency(page)
                await self.analyze_color_harmony(page)
                await self.analyze_content_density(page)
                await self.analyze_visual_balance(page)
                await self.analyze_alignment_consistency(page)
                await self.analyze_mobile_responsiveness(page)
                
                await browser.close()
                
                # 生成分析报告
                await self.generate_design_recommendations()
                
            except Exception as e:
                print(f"❌ 分析失败: {str(e)}")
                return False
            
            return True

if __name__ == "__main__":
    analyzer = VisualDesignAnalysis()
    success = asyncio.run(analyzer.run_visual_analysis())
    sys.exit(0 if success else 1)