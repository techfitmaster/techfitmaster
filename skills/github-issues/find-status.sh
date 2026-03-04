#!/bin/bash
# Find status enum definitions related to a keyword

KEYWORD=$1
PROJECT_PATH=${2:-"."}

if [ -z "$KEYWORD" ]; then
    echo "Usage: ./find-status.sh <keyword> [project_path]"
    echo "Example: ./find-status.sh Withdraw /Users/dresing/projects/818ys"
    exit 1
fi

echo "🔍 Searching for status enum related to: $KEYWORD"
echo "📂 Project path: $PROJECT_PATH"
echo ""

# Find Java enums
echo "=== Java Enums ==="
find "$PROJECT_PATH" -type f \( -name "*${KEYWORD}*Status*.java" -o -name "*Status*.java" \) 2>/dev/null | \
while read -r file; do
    if grep -q "enum" "$file" 2>/dev/null; then
        echo "📄 $file"
        echo "---"
        grep -A 20 "enum" "$file" | head -25
        echo ""
    fi
done

# Find TypeScript enums/constants
echo "=== TypeScript Enums/Constants ==="
find "$PROJECT_PATH" -type f -name "*status*.ts" 2>/dev/null | \
while read -r file; do
    if grep -q -E "enum|const.*STATUS|Record<string" "$file" 2>/dev/null; then
        echo "📄 $file"
        echo "---"
        grep -B 2 -A 15 -E "enum.*Status|const.*STATUS.*=|Record<string.*>" "$file" | head -25
        echo ""
    fi
done

# Find status mapping in utils
echo "=== Status Text Mapping ==="
find "$PROJECT_PATH" -type f -name "*status-text*.ts" -o -name "*statusText*.ts" 2>/dev/null | \
while read -r file; do
    echo "📄 $file"
    echo "---"
    grep -B 2 -A 10 "PENDING\|SUCCESS\|FAILED\|PROCESSING" "$file" | head -30
    echo ""
done
