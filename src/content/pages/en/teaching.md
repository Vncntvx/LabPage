---
locale: en
title: Teaching
description: Course materials, schedules, and teaching notes.
draft: true
permalink: /teaching/
pageId: teaching
nav: true
navOrder: 4
calendar:
  enabled: false
---

This page is the teaching hub for the group. It is maintained as a template
until a course has a confirmed instructor, term, schedule, and materials.

## Course catalog

Each course is a separate entry under `src/content/teachings/en/` and should
include:

- a short course description and learning outcomes;
- prerequisites, instructor, term, location, and meeting time;
- a week-by-week schedule with validated topics and descriptions;
- links to public notes, slides, assignments, or recordings when available.

The accompanying Chinese entry must use the same `course_id` and be kept in
sync with the English entry. Course entries in this repository are complete
examples, but remain drafts until they represent an actual offering.

## Teaching resources

Use the course body for stable teaching notes and the `schedule.materials`
field for downloadable resources. Keep private student records and internal
course links out of the public repository.

## Calendar

The calendar block is disabled in this template. Enable it only after adding a
public group calendar URL to the page frontmatter; the component never embeds a
personal calendar by default.
