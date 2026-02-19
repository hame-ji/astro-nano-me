---
title: "gogomate"
description: "CLI tool to generate personalized cover letters from a job posting URL."
date: "Apr 9 2025"
repoURL: "https://github.com/hame-ji/gogomate"
---

_Generate a personalized cover letter from a terminal!_

## Doing better

I had a working solution to help me write cover letters with [motivation-mate](/astro-nano-me/en/projects/project-1). But the level of simplicity was still insufficient for me. Launching the application, opening a browser, copy-pasting the URL and clicking the "Copy" button to save it to the clipboard seemed too tedious in practice.

What I was looking for was a single-command solution from a terminal: because I always have one open and navigating between applications with shortcuts is very fast.

## MVP

- **Reduce friction**: get the URL, paste it with the right command and that's it! No more clicks than necessary.
- **Centralize results**: store generated letters in a specific folder for tracking and organization.
- **Immediate access to results**: once the letter is generated, it's automatically copied to the clipboard for quick review.

## Golang

Many of my peers praised the Go developer experience and I wanted to see what it was like. Plus, the ability to easily produce executables interested me for future projects. These are the reasons why **gogomate** is entirely written in Go. The [repo](https://github.com/hame-ji/gogomate) is public on GitHub.

## Demo

Even though everything is explained in detail in the [README](https://github.com/hame-ji/gogomate/blob/main/README.md), here's a small example in action. You can use the script from the project but the real benefit is building the binary and moving it to the system path for global use. This way (after minimal configuration) you call the command `gogomate gen "https://example.com/job-posting" "optional-company-name"` and you're good to go!

![GIF](../gogomatedemo.gif)

A few seconds later, everything is ready!

![Screenshot](../gogomatedemo2.png)
