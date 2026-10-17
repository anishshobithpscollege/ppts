---
theme: ../../templates/anishshobithps
title: exifleak
author: Anish Shobith P S
info: |
  exifleak: a modular Bash scanner for EXIF metadata leaks.
  Built on the anishshobithps template (the look of anishshobithps.com).
duration: 5min
exportFilename: exifleak
download: exifleak.pdf
layout: cover
kicker: Shell scripting / M.E. CyberSecurity
---

# Your photos talk.

<p class="lead">
  <b>exifleak</b> is a small Bash script. It reads the <mark>metadata</mark> a photo gives away, then wipes it.
</p>

<div class="byline mono">
  <span>Anish Shobith P S</span><span>MSIS, MAHE</span>
</div>

::right::

<IsoStack
  :slabs="[
    { label: 'pixels.jpg', sub: 'what you see', w: 7, d: 4.6, h: 0.8 },
    { label: 'EXIF', sub: 'what you do not', tone: 'lit', w: 5.6, d: 3.6, h: 0.8 },
    { label: 'GPS', tone: 'lit', w: 3.4, d: 2.4, h: 0.7 },
  ]"
  :scale="38"
  :gap="1.5"
  :pin="{ slab: 2, label: '13.3525, 74.7928' }"
/>

<!--
⏱ 0:15 (ends 0:15)

SAY: Hi, I'm Anish. A photo is not just pixels. exifleak is a short Bash script that reads what a photo gives away and wipes it. The problem, the cases, the design, the code, a demo, and where it breaks.

NEXT → What is hiding in a photo.
-->

---
layout: split
section: The problem
cols: 5fr 6fr
---

# A photo is two files in one.

<p class="lead">
  Pixels you see, and an <mark>EXIF</mark> block you don't. The camera writes it. Every app that copies the file carries it along.
</p>

<div class="kept rise" style="--d: 300ms">
  <div class="label">Usually kept</div>
  <div class="pills">
    <Pill tone="bad">email</Pill><Pill tone="bad">cloud links</Pill><Pill tone="bad">AirDrop</Pill><Pill tone="bad">sent as document</Pill>
  </div>
  <div class="label">Usually stripped on upload</div>
  <div class="pills">
    <Pill tone="brand">Instagram</Pill><Pill tone="brand">Facebook</Pill><Pill tone="brand">X</Pill><Pill tone="brand">Signal</Pill>
  </div>
</div>

::right::

<div class="panel stagger fields">
  <div class="head label">What the script hunts</div>
  <div class="field"><div class="top"><span class="k">GPS Position</span><Pill tone="bad">location</Pill></div><span class="v">13 deg 21' 9.00" N, 74 deg 47' 34.08" E</span></div>
  <div class="field"><div class="top"><span class="k">Camera Model Name</span><Pill tone="warn">device</Pill></div><span class="v">iPhone 15 Pro</span></div>
  <div class="field"><div class="top"><span class="k">Serial Number</span><Pill tone="warn">device</Pill></div><span class="v">F2LDEMO12345</span></div>
  <div class="field"><div class="top"><span class="k">Artist</span><Pill tone="brand">identity</Pill></div><span class="v">Anish Shobith</span></div>
  <div class="field"><div class="top"><span class="k">Software</span><Pill>software</Pill></div><span class="v">iOS 18.1</span></div>
</div>

<!--
⏱ 0:30 (ends 0:45)

SAY: A JPEG carries a second payload, the EXIF block. The camera fills in where you stood, the phone model, its serial number, your name and what software touched it. These five lines are what my script hunts. Instagram, Facebook and X usually strip them on upload. Email, cloud links and sending as a file usually do not.

NEXT → Has this actually hurt anyone?
-->

---
layout: default
section: Why it matters
---

# It has already cost people.

<div class="cells c2 stagger">
  <div class="case">
    <div class="case-head"><span class="case-year mono">2007</span><h3>US Army, Iraq</h3><Cite href="https://www.itnews.com.au/news/apaches-destroyed-using-geotagged-photo-data-293745">iTnews, 2012</Cite></div>
    <p>Geotagged flightline photos helped attackers find four new Apache helicopters. Mortars destroyed them. The Army disclosed it in 2012.</p>
  </div>
  <div class="case">
    <div class="case-head"><span class="case-year mono">2010</span><h3>Adam Savage</h3><Cite href="https://www.benton.org/headlines/web-photos-reveal-secrets-where-you-live">NYT via Benton, Aug 2010</Cite></div>
    <p>He tweeted a photo of his car outside his home, captioned "off to work". The geotag gave the address.</p>
  </div>
  <div class="case">
    <div class="case-head"><span class="case-year mono">2012</span><h3>Higinio Ochoa</h3><Cite href="https://www.computerworld.com/article/1432091/embedded-data-not-breasts-brought-down-hacker-2.html">Computerworld, 2012</Cite></div>
    <p>The FBI says GPS in a photo of his girlfriend pointed to her home in Australia. He was arrested in March.</p>
  </div>
  <div class="case">
    <div class="case-head"><span class="case-year mono">2012</span><h3>John McAfee</h3><Cite href="https://thenextweb.com/insider/2012/12/03/it-gets-stranger-now-mcafee-claims-that-he-falsely-edited-the-metadata-on-the-photo-that-placed-him-in-guatemala/">The Next Web, 2012</Cite></div>
    <p>A published photo carried GPS that put him in Guatemala. He was arrested two days later, and later claimed he faked the data.</p>
  </div>
</div>

<div class="cells c1 stagger research-row">
  <div>
    <span class="label accent">Research</span>
    <span>Friedland and Sommer, HotSec 2010: geotags on Craigslist, YouTube and Twitter revealed homes and away-times.</span>
  </div>
</div>

<!--
⏱ 0:35 (ends 1:20)

SAY: This is not theory. In 2007 geotagged photos of new Apaches helped attackers find and destroy four of them. In 2010 a TV host tweeted his car outside his house, with the address inside the file. In 2012 the FBI tied a hacker to his girlfriend's house through a photo, and a published photo placed John McAfee in Guatemala. A 2010 paper showed this works at scale.

NEXT → So how is the tool built?
-->

---
layout: default
section: Design
---

# One job per function.

<div class="cells c4 pipe stagger">
  <div>
    <div class="label"><span class="accent">01</span> files</div>
    <code>for</code>
    <p>a file, or every image in a folder by glob</p>
  </div>
  <div>
    <div class="label"><span class="accent">02</span> fetch</div>
    <code>meta=$(exiftool)</code>
    <p>one call, kept in a variable</p>
  </div>
  <div class="lit">
    <div class="label accent"><span>03</span> detect</div>
    <code>DETECTORS</code>
    <ul class="chips">
      <li>detect_location</li>
      <li>detect_device</li>
      <li>detect_identity</li>
      <li>detect_software</li>
    </ul>
  </div>
  <div>
    <div class="label"><span class="accent">04</span> report</div>
    <code>show</code>
    <p>one <code>[TAG] line</code> each</p>
  </div>
</div>

<p class="rule-line rise" style="--d: 500ms">
  The loop never names a check. A new check is <mark>one function and one name</mark> in <code>DETECTORS</code>.
</p>

<!--
⏱ 0:25 (ends 1:45)

SAY: The shape is simple. A for loop walks the files. exiftool runs once and its text is kept in a variable. Then the loop runs every function named in DETECTORS. Each detector owns one leak type, and show is the only thing that prints. So a new check is one function and one name in the list.

NEXT → The script itself.
-->

---
layout: default
section: The script
---

<script setup>
import code from './exifleak.sh?raw'
</script>

<Snippet
  :code="code"
  lang="bash"
  title="exifleak.sh"
  numbers
  dense
  :font="15"
  class="script"
  :steps="[
    { lines: '6-13', label: 'the list, and the one helper that prints' },
    { lines: '15-25', label: 'awk: degrees + minutes/60 + seconds/3600' },
    { lines: '27-39', label: 'one tiny function per leak type' },
    { lines: '41-51', label: 'run every registered detector' },
  ]"
/>

<!--
⏱ 0:50 (ends 2:35)

SAY: Here is the whole script. Click. DETECTORS is just a list of names, and show is the helper: grep the line out of the exiftool text, take the first match, squeeze the spaces, print it with a label. Click. For location, awk adds degrees plus minutes over sixty plus seconds over thirty-six hundred, and flips the sign for south and west. That gives the map link. Click. The other detectors are two lines each. Click. inspect runs every name in the list.

NEXT → What commands are these?
-->

---
layout: default
section: How it works
---

# One field, start to finish.

<div class="cells c3 stagger how">
  <div>
    <div class="label accent">Every field</div>
    <ol class="steps">
      <li><code>exiftool "$1"</code><span>prints every tag as text, kept in <code>$meta</code></span></li>
      <li><code>grep -i "^Artist" | head -1</code><span>keeps the first line with that label</span></li>
      <li><code>tr -s ' '</code><span>squeezes the padding</span></li>
      <li><code>echo "[IDENTITY] $line"</code><span>prints it with its leak type</span></li>
    </ol>
  </div>
  <div>
    <div class="label accent">Location</div>
    <ul class="steps trace">
      <li><code>13 deg 21' 9.00" N</code><span>what exiftool prints</span></li>
      <li><code>13 deg 21 9.00 N</code><span><code>tr -d</code> drops <code>"</code> <code>'</code> <code>,</code></span></li>
      <li><code>13 + 21/60 + 9/3600</code><span><code>awk</code> adds degrees, minutes, seconds; S and W go negative</span></li>
      <li><code>?q=13.3525,74.7928</code><span>the map link</span></li>
    </ul>
  </div>
  <div>
    <div class="label accent">Run</div>
    <ul class="steps">
      <li><code>-s</code><span>picks <code>scrub</code>, otherwise <code>inspect</code></span></li>
      <li><code>for</code><span>hands each file, or each image in a folder, to <code>$action</code></span></li>
      <li><code>exiftool -all=</code><span>scrub: removes every tag in place</span></li>
      <li><code>clean</code><span>inspect: printed when no detector reports</span></li>
    </ul>
  </div>
</div>

<!--
⏱ 0:30 (ends 3:05)

SAY: Every field goes through the same four steps. exiftool prints all tags as text, grep and head keep the first line with the label, tr squeezes the padding, and echo prints it with its leak type. Location needs one more step: awk adds degrees, minutes over sixty and seconds over thirty-six hundred, and south or west flips the sign. That is the map link. Last, the dash s flag only changes which function runs for each file.

NEXT → Let's run it.
-->

---
layout: split
section: Demo
cols: 7fr 4fr
---

<Terminal title="~/photos" :font="14.5" class="demo">
  <div class="ln"><span class="t-prompt">$</span> ./exifleak.sh demo</div>
  <div class="ln"> </div>
  <div class="ln"><span class="t-dim">demo/IMG_4821.jpg</span></div>
  <div class="ln">  <span class="t-tag t-loc">[LOCATION]</span> GPS Position : 13 deg 21' 9.00" N, 74 deg 47' 34.08" E</div>
  <div class="ln">  <span class="t-tag t-loc">[LOCATION]</span> https://maps.google.com/?q=13.3525,74.7928</div>
  <div class="ln">  <span class="t-tag t-dev">[DEVICE]</span> Camera Model Name : iPhone 15 Pro</div>
  <div class="ln">  <span class="t-tag t-dev">[DEVICE]</span> Serial Number : F2LDEMO12345</div>
  <div class="ln">  <span class="t-tag t-id">[IDENTITY]</span> Artist : Anish Shobith</div>
  <div class="ln">  <span class="t-tag t-sw">[SOFTWARE]</span> Software : iOS 18.1</div>
  <div class="ln"> </div>
  <div class="ln"><span class="t-dim">demo/IMG_4822.jpg</span></div>
  <div class="ln">  <span class="t-tag t-dev">[DEVICE]</span> Camera Model Name : Pixel 8</div>
  <div class="ln"> </div>
  <div class="ln"><span class="t-dim">demo/IMG_4823.jpg</span></div>
  <div class="ln">  <span class="t-ok">clean</span></div>
</Terminal>

::right::

<div v-click class="after">
  <Terminal title="wipe it, then look again" :font="14.5">
    <div class="ln"><span class="t-prompt">$</span> ./exifleak.sh -s \</div>
    <div class="ln">    demo/IMG_4821.jpg</div>
    <div class="ln"><span class="t-ok">scrubbed</span> demo/IMG_4821.jpg</div>
    <div class="ln"><span class="t-prompt">$</span> ./exifleak.sh \</div>
    <div class="ln">    demo/IMG_4821.jpg</div>
    <div class="ln"> </div>
    <div class="ln"><span class="t-dim">demo/IMG_4821.jpg</span></div>
    <div class="ln">  <span class="t-ok">clean</span><span class="t-cursor" /></div>
  </Terminal>
</div>

<!--
⏱ 0:35 (ends 3:40)

SAY: Real output. I point it at a folder. The first photo gives away where it was taken, with a map link, the phone, its serial number, my name and the iOS version. The second shows only a device. The third is clean. Click. Now the dash s flag: exiftool wipes the file in place. Scan again and it is clean.

NEXT → Where does it break?
-->

---
layout: default
section: Limits
---

# Where it breaks.

<div class="cells c2 stagger limits">
  <div class="warn">
    <div class="label">Brittle by design</div>
    <h3>It reads ExifTool's labels</h3>
    <p>A camera that writes <code>Model</code> instead of <code>Camera Model Name</code> slips past <code>grep</code>. Add a pattern, or read <code>exiftool -s</code> names.</p>
  </div>
  <div>
    <div class="label">Scope</div>
    <h3>One folder level</h3>
    <p>No <code>**</code>: globstar needs bash 4, and macOS ships 3.2. The script runs on both.</p>
  </div>
  <div>
    <div class="label">ExifTool caveat</div>
    <h3>The wipe is not total</h3>
    <p>PDF edits are incremental, so old metadata stays recoverable. <code>-all=</code> also drops orientation and colour profile on JPEGs.</p>
    <Cite href="https://exiftool.org/exiftool_pod.html">ExifTool docs</Cite>
  </div>
  <div>
    <div class="label">Parser risk</div>
    <h3>The scanner is attack surface</h3>
    <p>ExifTool had RCE via DjVu (CVE-2021-22204, before 12.24) and filename injection (CVE-2022-23935, before 12.38). Stay patched.</p>
    <Cite href="https://nvd.nist.gov/vuln/detail/CVE-2022-23935">NVD</Cite>
  </div>
</div>

<!--
⏱ 0:25 (ends 4:05)

SAY: Honest limits. It parses exiftool's labels, so a camera that names a field differently slips past grep. It scans one folder level, because globstar needs bash 4 and a Mac has 3.2. The wipe is not total for PDFs. And exiftool itself has had remote code execution and filename injection bugs, so keep it patched.

NEXT → Takeaways.
-->

---
layout: end
---

<div class="end-row">
  <Logo :size="170" waving eyes="happy" />
  <div>

# Detect <span class="arrow-sep">→</span> Report <span class="arrow-sep">→</span> Scrub

<p class="lead">Share the scrubbed copy, never the original. <span class="muted">Questions?</span></p>

<div class="byline mono">
  <span>anishshobithps.com</span><span>github.com/anishshobithps</span>
</div>

  </div>
</div>

<!--
⏱ 0:10 (ends 4:15)

SAY: Detect, report, scrub. And one habit: share the scrubbed copy, not the original. Thank you. Questions?
-->
