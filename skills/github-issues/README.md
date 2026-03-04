# GitHub Issues Management Skill

> 🎯 **Purpose**: Create production-ready GitHub Issues with complete technical details following BDD format.

---

## 📦 What's Inside

```
github-issues/
├── SKILL.md           # Complete skill documentation
├── EXAMPLES.md        # Real-world usage examples
├── README.md          # This file
├── find-entity.sh     # Find database entities
├── find-apis.sh       # Find API endpoints
└── find-status.sh     # Find status enums
```

---

## 🚀 Quick Start

### 1. Use the Skill

When a user asks to:
- "Create a new bug/feature requirement"
- "Update an existing issue"
- "Analyze project requirements"

OpenClaw will automatically:
1. Read `SKILL.md` to understand the workflow
2. Investigate the codebase using helper scripts
3. Build a complete issue with BDD format
4. Achieve 10/10 completeness score

### 2. Manual Usage

```bash
cd /Users/dresing/.openclaw/workspace/skills/github-issues

# Find database entities
./find-entity.sh Payment /Users/dresing/projects/818ys

# Find API endpoints
./find-apis.sh withdraw /Users/dresing/projects/818ys

# Find status enums
./find-status.sh Withdraw /Users/dresing/projects/818ys
```

---

## ✨ Features

### Automatic Code Investigation
- ✅ Database schema extraction
- ✅ API endpoint mapping
- ✅ Status enum discovery
- ✅ Service layer identification

### BDD Format
- ✅ Given/When/Then scenarios
- ✅ Background and context
- ✅ Acceptance criteria

### Technical Completeness
- ✅ Database table structure
- ✅ API endpoints with file paths
- ✅ Root cause analysis (priority ranked)
- ✅ Solution recommendations (urgent + long-term)

### Quality Metrics
- ✅ Scoring system (target: 10/10)
- ✅ Completeness checklist
- ✅ Next steps planning

---

## 📊 Quality Score

| Component | Weight | Target |
|-----------|--------|--------|
| BDD Format | 20% | Given/When/Then complete |
| Technical Details | 30% | Database + API + Code paths |
| Root Cause | 20% | ≥3 causes with priority |
| Solutions | 20% | Urgent + Long-term |
| Acceptance | 10% | ≥5 specific criteria |

**Target Score**: ≥ 9/10 for production-ready issues

---

## 🎯 Real Examples

### Example 1: Bug Issue #154
- **Before**: 6/10 (basic BDD format)
- **After**: 10/10 (full technical details)
- **Key Discovery**: Callback endpoint deprecated
- **Result**: Developer fixed in 2-4 hours

### Example 2: Feature Request
- **Topic**: Room role switching
- **Investigation**: 15 minutes (entity + API + business rules)
- **Issue Quality**: 9/10 (ready for development)

See `EXAMPLES.md` for detailed walkthroughs.

---

## 🔧 Helper Scripts

### find-entity.sh
**Purpose**: Find database entities (Entity/AR/Model classes)

```bash
./find-entity.sh Payment /path/to/project
```

**Output**: 
- Java entities (@Entity, @Table)
- TypeScript models (interface, class)
- Key fields (id, status, etc.)

### find-apis.sh
**Purpose**: Find API endpoints (Controllers/APIs)

```bash
./find-apis.sh withdraw /path/to/project
```

**Output**:
- Java controllers (@GetMapping, @PostMapping, etc.)
- TypeScript APIs (router.get, async functions)
- File path and line numbers

### find-status.sh
**Purpose**: Find status enums and mappings

```bash
./find-status.sh Withdraw /path/to/project
```

**Output**:
- Java enums (enum OrderStatus)
- TypeScript enums/constants
- Status text mappings

---

## 📝 Workflow

```
User Request
    ↓
Understand requirement (Bug/Feature/Enhancement)
    ↓
Investigate codebase
  ├─ find-entity.sh    → Database layer
  ├─ find-apis.sh      → API layer
  └─ find-status.sh    → Enum definitions
    ↓
Extract information
  ├─ Table name, fields
  ├─ API endpoints, methods
  ├─ Status values
  └─ Service layers
    ↓
Root cause analysis (if bug)
  ├─ Rank by probability (⭐⭐⭐⭐⭐)
  ├─ Provide evidence
  └─ Reference code locations
    ↓
Build issue body
  ├─ BDD format (Given/When/Then)
  ├─ Database schema table
  ├─ API endpoints table
  ├─ Technical notes
  ├─ Solution recommendations
  └─ Acceptance criteria
    ↓
Create/Update issue
    ↓
Verify completeness (target: ≥9/10)
```

---

## 🎓 Learning from Real Cases

### Case Study: Issue #154

**Initial state**:
```markdown
## Bug
提现状态显示不准确

## Scenario
用户提现后状态不更新

## Acceptance Criteria
- [ ] 更新状态
```

**After investigation** (15 mins):
- Found: `PaymentController.java:186` - callback deprecated
- Found: `payment_order` table with `status` field
- Found: 8 related API endpoints
- Root cause: ⭐⭐⭐⭐⭐ Callback endpoint disabled

**Final issue** (10/10):
- 5428 characters
- Complete database schema
- 8 API endpoints mapped
- 5 root causes ranked by priority
- 2-tier solution (urgent + long-term)
- 7 specific acceptance criteria
- 5-step action plan

**Developer impact**: Fixed in 2-4 hours (vs. days of investigation)

---

## 💡 Tips

### DO ✅
1. **Investigate first** - Spend 10-15 min understanding codebase
2. **Use helper scripts** - Automate code discovery
3. **Be specific** - "状态在5分钟内更新" not "及时更新"
4. **Include code paths** - "PaymentController.java:186"
5. **Rank root causes** - Priority stars (⭐⭐⭐⭐⭐)

### DON'T ❌
1. **Vague descriptions** - "优化性能" without metrics
2. **Missing context** - No code references
3. **Generic criteria** - "功能正常" not measurable
4. **Skip investigation** - Writing issue without code check
5. **Ignore priority** - All issues labeled P0

---

## 🔄 Maintenance

### Update when:
- BDD template changes (`REQUIREMENT_SPEC.md`)
- New project patterns emerge
- Helper scripts need enhancement
- Quality metrics adjust

### Version History
- **v1.0.0** (2026-02-10) - Initial release based on Issue #154 experience

---

## 📚 Dependencies

### Required Files
- `REQUIREMENT_SPEC.md` - BDD template and standards
- GitHub CLI (`gh`) - Issue management
- Project repository access

### Optional
- GitHub Projects integration
- Issue templates (`.github/ISSUE_TEMPLATE/`)

---

## 🤝 Contributing

To improve this skill:

1. **Add new helper scripts**
   - Database migration finder
   - Test file locator
   - Dependency analyzer

2. **Enhance templates**
   - Mobile app specific sections
   - API versioning notes
   - Performance benchmarks

3. **Share examples**
   - Different project types
   - Various tech stacks
   - Complex scenarios

---

## 📖 Further Reading

- `SKILL.md` - Complete documentation
- `EXAMPLES.md` - Real-world walkthroughs
- `REQUIREMENT_SPEC.md` - BDD template reference
- GitHub Issues docs: https://docs.github.com/en/issues

---

**Created by**: Dressing (OpenClaw)  
**Date**: 2026-02-10  
**License**: MIT  
**Skill Level**: Advanced

**Questions?** Check `EXAMPLES.md` for step-by-step walkthroughs!
