#!/usr/bin/env python3
"""
Homepage Testing Script for www.godscode.com.cn
Tests layout, functionality, and visual coordination of the homepage
"""

import asyncio
import time
from playwright.async_api import async_playwright
import sys

class HomepageTest:
    def __init__(self):
        self.base_url = "https://www.godscode.com.cn"
        self.test_results = []
        
    def log_result(self, test_name, status, message=""):
        """记录测试结果"""
        self.test_results.append({
            'test': test_name,
            'status': status,
            'message': message
        })
        status_symbol = "✅" if status == "PASS" else "❌"
        print(f"{status_symbol} {test_name}: {message}")
    
    async def test_page_load(self, page):
        """测试页面加载"""
        try:
            # 设置更长的超时时间
            await page.goto(self.base_url, wait_until="networkidle", timeout=30000)
            await page.wait_for_load_state("domcontentloaded")
            
            # 检查页面标题
            title = await page.title()
            expected_title = "神典·Genesis智识图谱 | 新一代智能知识库"
            if expected_title in title:
                self.log_result("页面加载", "PASS", f"标题正确: {title}")
            else:
                self.log_result("页面加载", "FAIL", f"标题不匹配: 期待包含'{expected_title}', 实际'{title}'")
                
        except Exception as e:
            self.log_result("页面加载", "FAIL", f"加载失败: {str(e)}")
            
    async def test_navigation(self, page):
        """测试导航栏"""
        try:
            # 检查导航栏是否存在
            nav = await page.query_selector('.apple-nav')
            if nav:
                self.log_result("导航栏存在", "PASS", "导航栏元素找到")
                
                # 检查Logo
                logo = await page.query_selector('.nav-logo')
                if logo:
                    logo_text = await logo.text_content()
                    if "神典·Genesis智识图谱" in logo_text:
                        self.log_result("Logo显示", "PASS", f"Logo文字正确: {logo_text}")
                    else:
                        self.log_result("Logo显示", "FAIL", f"Logo文字不正确: {logo_text}")
                else:
                    self.log_result("Logo显示", "FAIL", "Logo元素未找到")
                
                # 检查导航链接
                nav_links = await page.query_selector_all('.nav-link')
                expected_links = ["产品方案", "技术创新", "成功案例", "关于我们"]
                actual_links = []
                
                for link in nav_links:
                    text = await link.text_content()
                    actual_links.append(text.strip())
                
                if set(expected_links).issubset(set(actual_links)):
                    self.log_result("导航链接", "PASS", f"导航链接正确: {actual_links}")
                else:
                    self.log_result("导航链接", "FAIL", f"导航链接不完整: 期待{expected_links}, 实际{actual_links}")
            else:
                self.log_result("导航栏存在", "FAIL", "导航栏元素未找到")
        except Exception as e:
            self.log_result("导航栏测试", "FAIL", f"测试异常: {str(e)}")
    
    async def test_hero_section(self, page):
        """测试Hero区域"""
        try:
            # 检查Hero区域
            hero = await page.query_selector('.apple-hero')
            if hero:
                self.log_result("Hero区域存在", "PASS", "Hero区域元素找到")
                
                # 检查标题
                title = await page.query_selector('.hero-title')
                if title:
                    title_text = await title.text_content()
                    if "新一代智能知识库" in title_text:
                        self.log_result("Hero标题", "PASS", f"标题正确: {title_text}")
                    else:
                        self.log_result("Hero标题", "FAIL", f"标题不正确: {title_text}")
                else:
                    self.log_result("Hero标题", "FAIL", "Hero标题元素未找到")
                
                # 检查副标题
                subtitle = await page.query_selector('.hero-subtitle')
                if subtitle:
                    subtitle_text = await subtitle.text_content()
                    if "GraphRAG技术" in subtitle_text:
                        self.log_result("Hero副标题", "PASS", f"副标题包含关键词: GraphRAG技术")
                    else:
                        self.log_result("Hero副标题", "FAIL", f"副标题缺少关键词: {subtitle_text}")
                else:
                    self.log_result("Hero副标题", "FAIL", "Hero副标题元素未找到")
                
                # 检查CTA按钮
                buttons = await page.query_selector_all('.hero-actions .apple-button')
                if len(buttons) >= 2:
                    button1_text = await buttons[0].text_content()
                    button2_text = await buttons[1].text_content()
                    self.log_result("CTA按钮", "PASS", f"找到{len(buttons)}个按钮: '{button1_text}', '{button2_text}'")
                else:
                    self.log_result("CTA按钮", "FAIL", f"CTA按钮数量不正确: {len(buttons)}")
            else:
                self.log_result("Hero区域存在", "FAIL", "Hero区域元素未找到")
        except Exception as e:
            self.log_result("Hero区域测试", "FAIL", f"测试异常: {str(e)}")
    
    async def test_features_section(self, page):
        """测试特性区域"""
        try:
            features_section = await page.query_selector('.apple-features')
            if features_section:
                self.log_result("特性区域存在", "PASS", "特性区域元素找到")
                
                # 检查区域标题
                section_title = await page.query_selector('.apple-features .section-title')
                if section_title:
                    title_text = await section_title.text_content()
                    if "四大核心优势" in title_text:
                        self.log_result("特性区域标题", "PASS", f"标题正确: {title_text}")
                    else:
                        self.log_result("特性区域标题", "FAIL", f"标题不正确: {title_text}")
                
                # 检查特性卡片
                feature_cards = await page.query_selector_all('.feature-card')
                expected_features = ["零幻觉推理引擎", "企业级知识图谱", "智能洞察发现", "内网数据安全"]
                
                if len(feature_cards) == 4:
                    self.log_result("特性卡片数量", "PASS", f"找到{len(feature_cards)}个特性卡片")
                    
                    # 检查每个特性的标题
                    actual_features = []
                    for card in feature_cards:
                        title_element = await card.query_selector('.feature-title')
                        if title_element:
                            title_text = await title_element.text_content()
                            actual_features.append(title_text.strip())
                    
                    if set(expected_features).issubset(set(actual_features)):
                        self.log_result("特性标题", "PASS", f"特性标题正确: {actual_features}")
                    else:
                        self.log_result("特性标题", "FAIL", f"特性标题不完整: 期待{expected_features}, 实际{actual_features}")
                else:
                    self.log_result("特性卡片数量", "FAIL", f"特性卡片数量不正确: {len(feature_cards)}")
            else:
                self.log_result("特性区域存在", "FAIL", "特性区域元素未找到")
        except Exception as e:
            self.log_result("特性区域测试", "FAIL", f"测试异常: {str(e)}")
    
    async def test_external_links(self, page):
        """测试外部链接"""
        try:
            # 测试体验智识问答链接
            qa_link = await page.query_selector('a[href*="webui.genesis.godscode.com.cn"]')
            if qa_link:
                href = await qa_link.get_attribute('href')
                target = await qa_link.get_attribute('target')
                if target == "_blank":
                    self.log_result("体验智识问答链接", "PASS", f"链接正确且在新窗口打开: {href}")
                else:
                    self.log_result("体验智识问答链接", "FAIL", f"链接未设置在新窗口打开: target={target}")
            else:
                self.log_result("体验智识问答链接", "FAIL", "体验智识问答链接未找到")
            
            # 测试史学图谱演示链接
            history_link = await page.query_selector('a[href*="history.api.genesis.godscode.com.cn"]')
            if history_link:
                href = await history_link.get_attribute('href')
                target = await history_link.get_attribute('target')
                if target == "_blank":
                    self.log_result("史学图谱演示链接", "PASS", f"链接正确且在新窗口打开: {href}")
                else:
                    self.log_result("史学图谱演示链接", "FAIL", f"链接未设置在新窗口打开: target={target}")
            else:
                self.log_result("史学图谱演示链接", "FAIL", "史学图谱演示链接未找到")
                
        except Exception as e:
            self.log_result("外部链接测试", "FAIL", f"测试异常: {str(e)}")
    
    async def test_images_loading(self, page):
        """测试图片加载"""
        try:
            # 等待图片加载
            await page.wait_for_timeout(3000)
            
            # 检查Logo图片
            logo_img = await page.query_selector('.nav-logo img')
            if logo_img:
                src = await logo_img.get_attribute('src')
                if src and not src.startswith('data:'):
                    self.log_result("Logo图片", "PASS", f"Logo图片路径: {src}")
                else:
                    self.log_result("Logo图片", "FAIL", f"Logo图片路径异常: {src}")
            else:
                self.log_result("Logo图片", "FAIL", "Logo图片元素未找到")
            
            # 检查解决方案图片
            solution_images = await page.query_selector_all('.solution-image img')
            if len(solution_images) > 0:
                self.log_result("解决方案图片", "PASS", f"找到{len(solution_images)}张解决方案图片")
                
                # 检查具体图片
                for i, img in enumerate(solution_images):
                    src = await img.get_attribute('src')
                    alt = await img.get_attribute('alt')
                    self.log_result(f"解决方案图片{i+1}", "PASS", f"图片{i+1}: {src} (alt: {alt})")
            else:
                self.log_result("解决方案图片", "FAIL", "解决方案图片未找到")
                
            # 检查案例图片
            case_images = await page.query_selector_all('.case-image img')
            if len(case_images) > 0:
                self.log_result("案例图片", "PASS", f"找到{len(case_images)}张案例图片")
            else:
                self.log_result("案例图片", "FAIL", "案例图片未找到")
                
        except Exception as e:
            self.log_result("图片加载测试", "FAIL", f"测试异常: {str(e)}")
    
    async def test_responsive_design(self, page):
        """测试响应式设计"""
        try:
            # 测试桌面视口
            await page.set_viewport_size({"width": 1920, "height": 1080})
            await page.wait_for_timeout(1000)
            
            nav_links = await page.query_selector('.nav-links')
            if nav_links:
                is_visible = await nav_links.is_visible()
                if is_visible:
                    self.log_result("桌面导航显示", "PASS", "桌面版导航链接正确显示")
                else:
                    self.log_result("桌面导航显示", "FAIL", "桌面版导航链接未显示")
            
            # 测试移动视口
            await page.set_viewport_size({"width": 375, "height": 667})
            await page.wait_for_timeout(1000)
            
            nav_links_mobile = await page.query_selector('.nav-links')
            if nav_links_mobile:
                is_visible_mobile = await nav_links_mobile.is_visible()
                if not is_visible_mobile:
                    self.log_result("移动端导航隐藏", "PASS", "移动端导航链接正确隐藏")
                else:
                    self.log_result("移动端导航隐藏", "FAIL", "移动端导航链接未正确隐藏")
            
            # 恢复桌面视口
            await page.set_viewport_size({"width": 1920, "height": 1080})
            
        except Exception as e:
            self.log_result("响应式设计测试", "FAIL", f"测试异常: {str(e)}")
    
    async def test_accessibility(self, page):
        """测试可访问性"""
        try:
            # 检查页面语言
            html_lang = await page.get_attribute('html', 'lang')
            if html_lang == 'zh-CN':
                self.log_result("页面语言", "PASS", f"页面语言设置正确: {html_lang}")
            else:
                self.log_result("页面语言", "FAIL", f"页面语言设置错误: {html_lang}")
            
            # 检查图片alt属性
            images = await page.query_selector_all('img')
            images_without_alt = 0
            for img in images:
                alt = await img.get_attribute('alt')
                if not alt:
                    images_without_alt += 1
            
            if images_without_alt == 0:
                self.log_result("图片Alt属性", "PASS", f"所有{len(images)}张图片都有alt属性")
            else:
                self.log_result("图片Alt属性", "FAIL", f"{images_without_alt}张图片缺少alt属性")
            
            # 检查标题层级
            headings = await page.query_selector_all('h1, h2, h3, h4, h5, h6')
            if len(headings) > 0:
                self.log_result("标题结构", "PASS", f"找到{len(headings)}个标题元素")
            else:
                self.log_result("标题结构", "FAIL", "未找到标题元素")
                
        except Exception as e:
            self.log_result("可访问性测试", "FAIL", f"测试异常: {str(e)}")
    
    async def run_all_tests(self):
        """运行所有测试"""
        async with async_playwright() as p:
            print("🚀 开始测试 www.godscode.com.cn 首页...")
            print("=" * 60)
            
            # 启动浏览器
            try:
                browser = await p.chromium.launch(headless=True)
                context = await browser.new_context(
                    viewport={'width': 1920, 'height': 1080},
                    user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                )
                page = await context.new_page()
                
                # 运行测试
                await self.test_page_load(page)
                await self.test_navigation(page)
                await self.test_hero_section(page)
                await self.test_features_section(page)
                await self.test_external_links(page)
                await self.test_images_loading(page)
                await self.test_responsive_design(page)
                await self.test_accessibility(page)
                
                await browser.close()
                
            except Exception as e:
                print(f"❌ 浏览器启动失败: {str(e)}")
                print("💡 尝试安装浏览器: playwright install chromium")
                return False
            
            # 输出测试总结
            print("\n" + "=" * 60)
            print("📊 测试总结:")
            print("=" * 60)
            
            passed = sum(1 for result in self.test_results if result['status'] == 'PASS')
            failed = sum(1 for result in self.test_results if result['status'] == 'FAIL')
            total = len(self.test_results)
            
            print(f"✅ 通过: {passed}")
            print(f"❌ 失败: {failed}")
            print(f"📈 总计: {total}")
            print(f"🎯 通过率: {(passed/total*100):.1f}%")
            
            if failed > 0:
                print("\n❌ 失败的测试:")
                for result in self.test_results:
                    if result['status'] == 'FAIL':
                        print(f"   • {result['test']}: {result['message']}")
            
            print("\n🎉 测试完成!")
            return failed == 0

if __name__ == "__main__":
    test = HomepageTest()
    success = asyncio.run(test.run_all_tests())
    sys.exit(0 if success else 1)