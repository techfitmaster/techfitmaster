#!/bin/bash
# Find API endpoints related to a keyword

KEYWORD=$1
PROJECT_PATH=${2:-"."}

if [ -z "$KEYWORD" ]; then
    echo "Usage: ./find-apis.sh <keyword> [project_path]"
    echo "Example: ./find-apis.sh withdraw /Users/dresing/projects/818ys"
    exit 1
fi

echo "🔍 Searching for APIs related to: $KEYWORD"
echo "📂 Project path: $PROJECT_PATH"
echo ""

# Find Java Controllers
echo "=== Java Controllers ==="
find "$PROJECT_PATH" -type f -name "*Controller.java" 2>/dev/null | \
xargs grep -n -i "$KEYWORD" 2>/dev/null | \
grep -E "@(GetMapping|PostMapping|PutMapping|DeleteMapping|PatchMapping|RequestMapping)" | \
while IFS=: read -r file line content; do
    echo "📄 $file:$line"
    echo "   $content"
    # Get the method signature
    sed -n "${line}p; $((line+1))p; $((line+2))p" "$file" 2>/dev/null | grep -A 2 "public"
    echo ""
done

# Find TypeScript APIs
echo "=== TypeScript APIs ==="
find "$PROJECT_PATH" -type f \( -name "*api.ts" -o -name "*Api.ts" -o -name "*controller.ts" \) 2>/dev/null | \
xargs grep -n -i "$KEYWORD" 2>/dev/null | \
grep -E "async|export.*function|router\.(get|post|put|delete|patch)" | \
while IFS=: read -r file line content; do
    echo "📄 $file:$line"
    echo "   $content"
    echo ""
done

# Summary
echo "=== Quick Reference ==="
echo "Filter by method:"
echo "  GET:    grep -E 'GetMapping|get\\('"
echo "  POST:   grep -E 'PostMapping|post\\('"
echo "  PUT:    grep -E 'PutMapping|put\\('"
echo "  DELETE: grep -E 'DeleteMapping|delete\\('"
