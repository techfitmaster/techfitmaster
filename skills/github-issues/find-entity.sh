#!/bin/bash
# Find database entity files related to a keyword

KEYWORD=$1
PROJECT_PATH=${2:-"."}

if [ -z "$KEYWORD" ]; then
    echo "Usage: ./find-entity.sh <keyword> [project_path]"
    echo "Example: ./find-entity.sh Payment /Users/dresing/projects/818ys"
    exit 1
fi

echo "🔍 Searching for entity related to: $KEYWORD"
echo "📂 Project path: $PROJECT_PATH"
echo ""

# Find Java entities
echo "=== Java Entities ==="
find "$PROJECT_PATH" -type f \( -name "*${KEYWORD}*Entity.java" -o -name "*${KEYWORD}*AR.java" -o -name "*${KEYWORD}*Model.java" \) 2>/dev/null | \
while read -r file; do
    echo "📄 $file"
    echo "---"
    head -80 "$file" | grep -A 3 -B 3 "class\|@Entity\|@Table\|private.*id\|private.*status"
    echo ""
done

# Find TypeScript models
echo "=== TypeScript Models ==="
find "$PROJECT_PATH" -type f \( -name "*${KEYWORD}*.ts" -o -name "*${KEYWORD}*.model.ts" \) 2>/dev/null | \
while read -r file; do
    if grep -q "interface\|class\|type" "$file" 2>/dev/null; then
        echo "📄 $file"
        echo "---"
        head -50 "$file"
        echo ""
    fi
done
