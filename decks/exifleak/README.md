# exifleak

Five-minute talk on `exifleak.sh`, a modular Bash scanner that finds EXIF metadata leaks
(location, device, identity, software) in photos and can scrub them.

- Template: [`anishshobithps`](../../templates/anishshobithps)
- Slides: [`slides.md`](slides.md), 9 slides, 5 clicks in total (4 in the Monaco editor, 1 in the demo), timed presenter notes (about 4:15)
- The script: [`exifleak.sh`](exifleak.sh), the tested version; slide 5 loads this file into Monaco
- Deck-only: `style.css`
- Exports: [`exports/`](exports)

```bash
pnpm dev exifleak          # presenter view at /presenter/
pnpm export exifleak
```

## The script

[`exifleak.sh`](exifleak.sh) uses only everyday tools: `grep -i`, `head`, `cut`, `tr`, `awk`,
`[ ]` tests, `if`, `for`, `$1 $# $0 $?`, `2> /dev/null`, extended globs, plus `exiftool`
itself (`-all=` wipes). Functions, `$( )` and `shift` are the only structure beyond plain
sequences.

It keeps the modular design (one function per leak type, a `DETECTORS` list, one `show` helper)
and runs on the stock macOS `/bin/bash` 3.2 as well as bash 5: no arrays, no `declare -A`, no
`globstar`. The output on the demo slide is a real run.

The earlier draft used `declare -A`, `${FIELDS[@]/#/-}` and `exiftool -n -T`. Testing it showed
two problems, both gone with this version: `present X && emit ...` at the end of a detector made
`set -e` end the scan at the first photo with no `Software` tag, and macOS bash 3.2 has no
associative arrays.

## Sources

- US Army, 2007 Apaches: [iTnews, 2012](https://www.itnews.com.au/news/apaches-destroyed-using-geotagged-photo-data-293745)
  (Steve Warren, Maneuver Center of Excellence); also [Military.com, 2012](https://www.military.com/defensetech/2012/03/15/insurgents-used-cell-phone-geotags-to-destroy-ah-64s-in-iraq)
- Adam Savage: NYT, "Web Photos That Reveal Secrets, Like Where You Live", Aug 2010,
  via [Benton](https://www.benton.org/headlines/web-photos-reveal-secrets-where-you-live)
- Higinio Ochoa: [Computerworld, Apr 2012](https://www.computerworld.com/article/1432091/embedded-data-not-breasts-brought-down-hacker-2.html), allegations as reported
- John McAfee: [The Next Web, 3 Dec 2012](https://thenextweb.com/insider/2012/12/03/it-gets-stranger-now-mcafee-claims-that-he-falsely-edited-the-metadata-on-the-photo-that-placed-him-in-guatemala/)
- Friedland and Sommer, [Cybercasing the Joint](https://www.usenix.org/conference/hotsec10/cybercasing-joint-privacy-implications-geo-tagging), HotSec 2010
- ExifTool: [`-T`, `-n`, `-m`, `--`, PDF caveat](https://exiftool.org/exiftool_pod.html), [FAQ 32 on removing metadata](https://exiftool.org/faq.html)
- [CVE-2022-23935](https://nvd.nist.gov/vuln/detail/CVE-2022-23935) (filename ending in `|`, before 12.38),
  CVE-2021-22204 (DjVu, before 12.24)
- [Exif 3.0](https://iptc.org/news/exif-3-0-released-featuring-utf-8-support/) (CIPA DC-008-2023, UTF-8 text)
- Platform behaviour (which apps strip EXIF) varies by app and version: test with your own file.
