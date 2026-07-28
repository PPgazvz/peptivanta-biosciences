# COA 文件盘点与网站映射

盘点日期：2026-07-28

## 1. 两个目录的总体关系

- 目录 A：`time/肽常用文件/COA`，共 127 个文件，约 26.80 MB。
- 目录 B：`time/新机需要的软件+素材/素材/coa检测报告的使用说明/产品对应coa检测报告`，共 99 个文件，约 18.25 MB。
- B 中有 91 个文件与 A 的文件内容完全一致。
- B 中剩余 8 个 `coa3.22更新/photo_*.jpg`，分别对应 A 中 `老COA/新建文件夹 (2)` 的 8 份 Vanguard 报告；它们是更清晰或重新保存的版本，不构成新增产品覆盖。
- 结论：B 是 A 的发布素材子集，但 B 中的 8 份 Vanguard 图片质量更适合作为后续归档来源。

## 2. 内容完全相同的重复文件

目录 A 内发现 3 组完全重复内容：

1. `COA/COA 3.24更新/COA 先锋 2/Selank-10mg.jpg`
   与 `Selank-10mg (1).jpg`
2. `COA/COA 3.24更新/COA1/AOD-9604 5mg.jpg`
   与 `AOD-9604 5mg (2).jpg`
3. `COA/老COA/910068e8-86e0-41cb-88af-d20bb35d6827.png`
   与 `d290cffb-7ff6-4de6-a501-3bb8b4c49f99.png`

目录 B 内没有发现内容完全相同的重复文件。

## 3. 同产品、同规格的多份文件

以下产品规格在当前文件中出现多次，但文件内容不一定相同。它们可能来自不同实验室、检测项目或批次，不能仅凭产品名批量删除：

- AOD-9604 5 mg
- BPC-157 10 mg
- BPC-157 / TB-500 10 mg + 10 mg
- GHK-Cu 50 mg
- GLP-R 20 mg
- GLP-T 30 mg
- GLP-T 60 mg
- Ipamorelin 10 mg
- KLOW 80 mg
- KPV 10 mg
- MOTS-C 10 mg
- NAD+ 500 mg
- PT-141 10 mg
- Retatrutide 10 mg
- Selank 10 mg
- Semax 10 mg
- Sermorelin 5 mg
- TB-500 10 mg
- Tesamorelin 10 mg

整理时应优先保留具有清晰产品名、规格、检测机构、报告日期、批号/样品号和检测结果的版本。

## 4. A 有而 B 没有的内容

目录 B 未包含：

- `4.4` 中的 GHK-Cu 100 mg、GLP-3RT 30 mg、HGH 15 IU 和 HGH PDF。
- `4.4/客户自检.jpg`，该文件是聊天截图，不应归类为正式 COA。
- `老COA` 下的历史 Janoshik 报告。
- `老COA/深圳COA` 下的 Glutathione、NAD+、GHK-Cu 原料 COA/测试报告。

## 5. 网站现有目录的 COA 覆盖

| 网站产品 | 当前文件覆盖 | 状态 |
| --- | --- | --- |
| Retatrutide | 5 / 10 / 15 / 20 / 30 mg | 有直接匹配 |
| Tirzepatide | 10 / 15 / 30 / 60 mg | 有直接匹配 |
| Semaglutide | 5 / 10 / 30 mg | 有直接匹配 |
| BPC-157 | 5 / 10 / 20 mg | 有直接匹配 |
| TB-500 | 10 mg；另有 BPC-157 复配 | 有直接匹配 |
| CJC-1295 | 目前主要是 CJC / Ipamorelin 复配 | 独立产品待补 |
| Ipamorelin | 10 mg；另有 CJC 复配 | 有直接匹配 |
| MOTS-C | 10 / 40 mg | 有直接匹配 |
| GHK-Cu | 50 / 100 mg、原料文件 | 有直接匹配 |
| Acetyl Hexapeptide-8 | 未找到明确对应文件 | 待补 |

## 6. 需要人工复核的文件

- `客户自检.jpg` 是沟通截图，不是实验室 COA。
- `GLP-T`、`GLP-R`、`GLP-S`、`GLP-2T`、`GLP-3RT` 应确认正式产品名称后再统一改名。
- `736992-21-5.jpg` 应确认 CAS 对应产品，不应只用数字作为公开文件名。
- `S-31-S 50mg.jpg` 应确认是否为 SS-31。
- `Thymosin Alpha I`、`NA Selenk Amidate` 等文件名存在字母或拼写问题。
- HCG 报告标题使用 `1000 mg`，结果表使用约 `1020 IU`，单位需要在使用前复核。
- 部分第三方报告包含客户名、样品照片、实验室联系信息或批号，不建议未经筛选直接公开。

## 7. 建议的主档结构

本次未移动或删除原文件。后续可把 A 作为主档，按以下结构整理：

```text
COA-MASTER/
  CURRENT/
    Product/
      Strength/
        YYYY-MM-DD_Lab_Batch_TestType.ext
  LEGACY/
  NEEDS-REVIEW/
  NON-COA/
  DUPLICATES/
```

网站只公开产品与规格的文件索引。实际报告应在确认产品、规格、来源和批次后定向提供，避免把一份报告当作所有批次的通用证明。
