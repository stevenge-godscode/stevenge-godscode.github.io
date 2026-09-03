# Homepage V55 — Strict Paging and Subtle Chapter Navigation

## Decision

The homepage now uses strict viewport paging on desktop.

Sequence:

Hero → 01 IN THE DARKNESS → 02 DRAW THE MAP → 03 USE THE MAP → 04 BUSINESS SCENARIO → CTA

## Paging rule

Each page occupies exactly the visible viewport below the 48px top navigation:

`100dvh - 48px`

A wheel / trackpad gesture advances or reverses one page at a time. After the smooth transition, the page position is corrected to the exact target offset so no previous or next chapter remains partially visible.

Only one navigation offset is applied. The previous double-offset combination of scroll padding and scroll margin is removed.

## Scenario boundary

The customer-risk example is not part of chapter 03.

03 explains how AI uses the map.

04 is a separate BUSINESS SCENARIO section that demonstrates the mechanism in a real business problem.

## Page navigation

The previous top-right text links are removed.

The top bar keeps only the Genesis brand and Contact CTA.

Internal chapter navigation is moved to a low-profile vertical dot rail at the middle-right edge of the viewport:

- 01 看不全
- 02 画地图
- 03 用地图
- 04 场景

The rail shows only subtle dots by default. The current section expands into a short bar. Labels appear only on hover/focus.

Mobile keeps normal scrolling and hides the dot rail.