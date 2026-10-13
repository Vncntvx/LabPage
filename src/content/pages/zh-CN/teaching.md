---
locale: zh-CN
title: 教学
description: 课程安排、教学资料与课程笔记。
draft: true
permalink: /teaching/
pageId: teaching
nav: true
navOrder: 4
calendar:
  enabled: false
---

这里是课题组教学内容的统一入口。本页作为模板维护；当课程的授课教师、学期、
安排和公开资料确认后，再将其发布。

## 课程目录

每门课程都应在 `src/content/teachings/zh-CN/` 下独立维护，并包含：

- 课程简介与学习目标；
- 先修要求、授课教师、学期、地点和上课时间；
- 按周编排且主题与说明完整的课程表；
- 可公开的讲义、课件、作业或录播链接。

中文条目必须与英文条目使用相同的 `course_id`，并保持内容同步。仓库中的课程条目
是完整的示例，但在对应真实课程前均保持草稿状态。

## 教学资料

稳定的教学说明写在课程正文中，可下载资料通过 `schedule.materials` 字段提供。
不要把学生隐私或仅限内部访问的课程链接提交到公开仓库。

## 日历

模板默认关闭日历。只有在 frontmatter 中配置公开的课题组日历 URL 后才应启用；
组件不会默认嵌入个人日历。
