---
layout: post
title:  "Why iCloud Photos is slow to \"upload\" on macOS"
date:   2020-11-12 00:00:00 -0500
categories: software
---

The word *uploads* is in quotes for a reason. Let's find out why...

# The Test Setup
- 2019 16" MacBook Pro
  - 2.6 GHz 6-Core Intel Core i7
  - macOS Catalina 10.15.7
  - Photos 5.0 (161.0.120)
- Roughly 1,800 media files (JPG, HEIC, PNG, MOV, MP4) totaling 50GB
- Full gigabit connection (1,000 Mbps up, 1,000 Mbps down)
- Google Photos as a benchmark for comparison

# Testing Google Photos

First, I tried Google Photos. Drag-and-drop into the Chrome tab. Roughly 20 minutes later all 50GB worth of media is done uploading.

I'm able to view most my media instantly online. Google takes 3 hours to further process 160 videos in my upload; likely to convert them into a more compatible format (*foreshadowing*).

This experience seems reasonable, so let's use it as our baseline.

# Testing iCloud Photos

I upgrade my account to the 200GB tier and enable iCloud Photo syncing on my Mac. Drag and drop the media files into the native Photos app and off we go!

One hour later... only 31 items uploaded. 😯

Eight hours later... only 97 items uploaded. 🤔

My ISP can't be the issue. Google Photos had worked fine. I'm able to browser the web just fine. My Mac doesn't seem to be doing anything intensive either; no excessive heat or fan noise.

A few DuckDuckGo searches later, it's becoming very apparent others are experiencing the same issue. Most people blame Apple's servers for being slow or rant about how bad their ISP is. Something doesn't seem right.

# An easy clue

I start my debugging process in Activity Monitor. Things become obvious very quick:

![iCloud Photos Upload Processes](/assets/icloud-photos-activity-monitor.png)

Let's breakdown the two processes:

`VTEncoderXPCService` is a sandboxed host used by QuickTime for video and audio decoding. The VT stands for `VideoTooolbox`. It's used to process content when an app calls the built-in macOS audio and video API. It could be triggered by the Photos app, but it could also be a video playing in a web browser like Firefox.

`com.apple.photos.VideoConversionService` doesnt need an explanation. The name gives it all away.

Considering the latter process name and the fact that I didn't have any other apps open at the time, it's pretty obvious Photos is doing some sort of video conversion. But why?

After some more research, I came across the following statement on Apple's website:

> File types that you can use with iCloud Photos

> Your photos and videos are stored in iCloud exactly as you took them. All of your images are held in their original formats at full resolution — HEIF, JPEG, RAW, PNG, GIF, TIFF, HEVC, and MP4 — as well as special formats you capture with your iPhone, like slo-mo, time-lapse, 4K videos, and Live Photos.

Source: [https://support.apple.com/en-us/HT204264](https://support.apple.com/en-us/HT204264)

Ah ha! If you recall earlier, I mentioned my test media included MOV files. These are old family videos converted and exported via QuickTime Player. MOV is not a supported format according to the above statement.

Additionally, when I track the upload count in the Photos app, I can infer that media is being uploaded by date; newest to oldest. The count consistently lags at the index of an MOV file. 

![Photos Progress Bar](/assets/icloud-photos-progress-bar.png)

# What's happening?

Photos is likely converting incompatible media files into an iCloud desired format before uploading them.

More importantly, **it seems Apple has made the architectural decision to convert incompatible iCloud media on the end user's device, instead of processing it in the cloud** like Google Photos.

# So what?

Converting before uploading isn't a big deal. Heck, I give Apple credit for choosing a decentralized and cost efficient architecture.

**The real issue is an overly simplified user experience that's missing transparency.** It took an  engineer an hour to figure out what was happening. I can only imagine how millions of non-technical Apple users would feel. Search Google and you'll see the widespread frustration and confusion with iCloud Photos and "slow uploads."  

# Ok fine. But why is it so slow?

We all know when our Mac has entered beast mode to tackle CPU intensive tasks; fans blazing and toasty to the touch. Try converting video files in [HandBrake](http://handbrake.fr) and you'll see exactly what I'm saying.

**The Photos app however, avoids beast mode and slows the rate of video conversion in the background.** It makes sense that Apple does not want to impair your foreground experience or raise concerns by running your Mac at full speed. **But it also makes it really hard to see what's happening and significantly increases the time required to complete conversions.**

# Potential improvements

Here are a few recommendations (for Apple) that could improve the perception and experience with iCloud Photos on macOS:

- Call out incompatible media. **Make it known when media needs to be converted.** Or require incompatible media to be converted upon import into the Photos app.
- A progress bar stuck at 90% is more satisfying than one at 50%. **Prioritize the upload of compatible media first.** If your incompatible media is more recent, you'll be stuck waiting for it convert before anything else gets uploaded.
- **Provide more insight** as to when uploading vs conversion is happening behind-the-scenes.
- **Run full speed conversions when the Photos app is in the foreground.**

# So how long did it end up taking me?

My Mac has been plugged in 24/7 for the past 4 days and I still have 177 items left to "upload."

# tl;dr

iCloud Photos on macOS converts incompatible media locally before uploading to iCloud. It disguises the conversion process as part of the "upload" phase for iCloud Photos.

*This issue is only with incompatible media imported to iCloud Photos via the Mac Photos app. It's very unlikely your iPhone or iPad would be taking pictures and videos in an incompatible format.* 