#!/bin/bash
# exifleak.sh - show what a photo gives away, or wipe it.
#   ./exifleak.sh photo.jpg folder ...      report
#   ./exifleak.sh -s photo.jpg folder ...   wipe all metadata

DETECTORS="detect_location detect_device detect_identity detect_software"

show() {   # show LABEL "Tag name"
    line=$(echo "$meta" | grep -i "^$2" | head -1 | tr -s ' ')
    if [ -n "$line" ]; then
        echo "  [$1] $line"
    fi
}

detect_location() {
    show LOCATION "GPS Position"
    maps=$(echo "$meta" | grep "^GPS Position" | cut -d: -f2- | tr -d "\"'," |
           awk '{ lat = $1 + $3/60 + $4/3600; lon = $6 + $8/60 + $9/3600
                  if ($5 == "S") lat = -lat
                  if ($10 == "W") lon = -lon
                  printf "%.4f,%.4f\n", lat, lon }')
    if [ -n "$maps" ]; then
        echo "  [LOCATION] https://maps.google.com/?q=$maps"
    fi
}

detect_device() {
    show DEVICE "Camera Model"
    show DEVICE "Serial Number"
}

detect_identity() {
    show IDENTITY "Artist"
    show IDENTITY "Owner Name"
}

detect_software() {
    show SOFTWARE "Software"
}

inspect() {
    meta=$(exiftool "$1" 2> /dev/null)
    echo
    echo "$1"
    report=$(for d in $DETECTORS; do $d; done)
    if [ -z "$report" ]; then
        echo "  clean"
    else
        echo "$report"
    fi
}

scrub() {
    exiftool -overwrite_original -all= "$1" > /dev/null 2>&1
    echo "scrubbed $1"
}

# ---- main
if [ $# -eq 0 ]; then
    echo "Usage: $0 [-s] file|folder ..."
    exit 1
fi

exiftool -ver > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "install exiftool first"
    exit 1
fi

action=inspect
if [ "$1" = "-s" ]; then
    action=scrub
    shift
fi

shopt -s extglob nocaseglob
for target in "$@"
do
    if [ -d "$target" ]; then
        for file in "$target"/*.@(jpg|jpeg|png|heic|tiff)
        do
            [ -f "$file" ] && $action "$file"
        done
    else
        $action "$target"
    fi
done
