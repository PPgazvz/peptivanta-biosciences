# Peptivanta Biosciences 独立站源码

面向专业客户的多语言 B2B 多肽产品展示与询盘网站。网站目前支持英语、
葡萄牙语、西班牙语、法语和中文，默认语言为英语。

## 最常修改：WhatsApp 和企业邮箱

所有联系方式都集中在根目录的 `site.config.ts`。以后不要在页面代码中
逐个查找号码或邮箱，只修改这个配置文件即可。

### 修改 WhatsApp

找到下面这一行：

```ts
whatsappNumber: "19863059927",
```

把引号内的数字替换为新号码。号码必须包含国家/地区代码，并且只填写数字：

```ts
// 美国或加拿大号码示例
whatsappNumber: "19863059927",

// 中国大陆号码示例
whatsappNumber: "8613812345678",
```

不要填写 `+`、空格、括号或短横线。修改后，产品询价按钮、询盘表单和右下角
WhatsApp 按钮会一起更新。

### 修改企业邮箱

找到下面这一行：

```ts
salesEmail: "",
```

替换为准备好的企业邮箱：

```ts
salesEmail: "sales@yourdomain.com",
```

邮箱留空时网站会自动隐藏邮箱，不会显示空白地址。

### 修改公司资料

同一个文件中还可以修改：

```ts
operatingRegion: "Hong Kong SAR · Sales & Export Coordination",
registeredAddress: "经过核实的注册地址",
responseTime: "Within one business day",
```

注册地址留空时网站会自动隐藏。公司地址、认证、资质和工厂信息应当与可提供的
证明文件保持一致。

## 常用文件

- `site.config.ts` — WhatsApp、邮箱、品牌和公司资料
- `app/page.tsx` — 首页内容、多语言文字和产品目录
- `app/globals.css` — 字体、颜色、版式和手机端样式
- `public/images` — 网站照片素材
- `app/privacy`、`app/terms`、`app/compliance` — 合规与法律页面

## 本地预览

第一次下载源码后：

```bash
npm install
npm run dev
```

修改完成后进行检查：

```bash
npm run build
```

## 网站内容定位

网站采用专业客户询盘模式，不提供在线直接结账，也不在公开页面提供剂量、
注射方法、疾病治疗或个人医疗建议。
