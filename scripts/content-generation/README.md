# Content Generation Tools
*STEM Learning Application - Content Enhancement Suite*

## 🎯 Overview

This directory contains comprehensive tools for auditing, analyzing, and generating educational content for the STEM Learning Application. These tools help identify content gaps and automate the creation of standardized lesson content.

## 📁 Files Overview

### Core Templates
- **`standardized-lesson-template.json`** - Complete lesson structure template
- **`unified-question-template.json`** - Question type definitions and guidelines

### Analysis Tools
- **`content-audit.js`** - Comprehensive content analysis and gap identification
- **`gap-analysis-report.md`** - Detailed gap analysis with recommendations

### Generation Tools
- **`question-generator.js`** - Automated question generation based on templates
- **`implementation-plan.md`** - Step-by-step implementation roadmap

## 🚀 Quick Start

### 1. Run Content Audit
```bash
cd scripts/content-generation
node content-audit.js
```

This will:
- Analyze all modules across 5 subjects
- Identify content gaps and issues
- Generate recommendations
- Save results to `audit-results.json`

### 2. Generate Questions
```bash
# Generate for all subjects
node question-generator.js

# Generate for specific subject
node question-generator.js --subject biology

# Show help
node question-generator.js --help
```

### 3. Review Generated Content
Check the `generated-questions/` folder for output files.

## 🛠️ Tool Details

### Content Audit Tool (`content-audit.js`)

**Purpose**: Comprehensive analysis of existing content to identify gaps and inconsistencies.

**Features**:
- Analyzes all subjects (Biology, Chemistry, Physics, Mathematics, ICT)
- Identifies missing questions, Ghana context, and structural issues
- Generates prioritized recommendations
- Creates detailed gap analysis reports

**Output**:
- Console summary with key findings
- `audit-results.json` with detailed analysis
- Priority-based recommendations

**Usage**:
```bash
node content-audit.js
```

### Question Generator (`question-generator.js`)

**Purpose**: Automatically generates questions based on standardized templates and content analysis.

**Features**:
- Generates questions for all question types
- Maintains proper difficulty distribution (40/40/20)
- Includes Ghana context examples
- Follows WASSCE alignment guidelines

**Question Types Generated**:
- Multiple Choice (45%)
- True/False (20%)
- Fill-in-the-Blank (15%)
- Short Answer (10%)
- Problem Solving (10%)

**Usage**:
```bash
# Generate for all subjects
node question-generator.js

# Generate for specific subject
node question-generator.js --subject chemistry

# Show help
node question-generator.js --help
```

**Output**: JSON files in `generated-questions/` folder

## 📊 Templates

### Standardized Lesson Template

The `standardized-lesson-template.json` provides a comprehensive structure for lessons including:

- **Content Structure**: Introduction, main content, summary
- **Assessment System**: Knowledge checks, practice exercises, formative assessments
- **Ghana Context**: Local examples, cultural connections, real-world applications
- **Gamification**: XP rewards, achievements, milestones
- **Metadata**: Creation info, versioning, WASSCE alignment

### Unified Question Template

The `unified-question-template.json` defines:

- **Question Types**: 9 different question formats with examples
- **Difficulty Levels**: Basic, intermediate, and advanced characteristics
- **Quality Standards**: Clarity, relevance, fairness, WASSCE alignment
- **Distribution Guidelines**: Target percentages for question types and difficulty

## 📈 Current Status

### Content Gaps Identified
- **Total Questions Needed**: 364 additional questions
- **Average Gap**: 70% below target (6.1 vs 15-20 questions per lesson)
- **Priority Subjects**: ICT (critical), Biology/Chemistry/Physics/Mathematics (high)

### Question Type Distribution
- **Missing Types**: Fill-in-blank, short answer, matching, scenario challenges
- **Current Focus**: MCQ and True/False only
- **Target**: 8-9 different question types per lesson

### Difficulty Balance
- **Current**: 70% basic, 25% intermediate, 5% advanced
- **Target**: 40% basic, 40% intermediate, 20% advanced

## 🎯 Implementation Roadmap

### Week 1: Critical Fixes
- [ ] ICT module restructuring
- [ ] Question type implementation
- [ ] Basic question generation

### Week 2: Content Enhancement
- [ ] Question quantity targets
- [ ] Difficulty balance adjustment
- [ ] Ghana context enhancement

### Week 3-4: Advanced Features
- [ ] Formative assessments
- [ ] Practice exercises
- [ ] Visual aids integration

### Week 5-6: Quality & Testing
- [ ] Content review and validation
- [ ] Technical testing
- [ ] Student feedback integration

## 🔧 Technical Requirements

### Prerequisites
- Node.js (v14 or higher)
- Access to content directory (`src/content/`)
- Basic understanding of JSON structure

### Dependencies
- Built-in Node.js modules only (fs, path)
- No external packages required

### File Structure
```
scripts/content-generation/
├── README.md                           # This file
├── standardized-lesson-template.json   # Lesson structure template
├── unified-question-template.json     # Question type templates
├── content-audit.js                   # Audit and analysis tool
├── question-generator.js              # Question generation tool
├── gap-analysis-report.md             # Gap analysis report
├── implementation-plan.md             # Implementation roadmap
├── generated-questions/               # Output folder (auto-created)
└── audit-results.json                 # Audit results (auto-created)
```

## 📋 Usage Examples

### Example 1: Complete Content Audit
```bash
cd scripts/content-generation
node content-audit.js
```

**Output**: Comprehensive analysis of all content with recommendations

### Example 2: Generate Biology Questions
```bash
cd scripts/content-generation
node question-generator.js --subject biology
```

**Output**: `generated-questions/biology-*.json` files with enhanced questions

### Example 3: Generate All Questions
```bash
cd scripts/content-generation
node question-generator.js
```

**Output**: Question files for all subjects in `generated-questions/` folder

## 🚨 Troubleshooting

### Common Issues

**Issue**: "Subject directory not found"
**Solution**: Ensure you're running from the correct directory and content exists

**Issue**: "No lessons found in module"
**Solution**: Check that modules have proper `lessons` array structure

**Issue**: "Error reading module"
**Solution**: Verify JSON syntax and file permissions

### Debug Mode
Add console.log statements in the scripts to debug specific issues:

```javascript
// In content-audit.js or question-generator.js
console.log('Debug:', { subject, modulePath, moduleData });
```

## 📚 Best Practices

### Content Creation
1. **Use Templates**: Always start with standardized templates
2. **Maintain Consistency**: Follow established patterns across subjects
3. **Include Ghana Context**: Ensure local relevance and cultural sensitivity
4. **Quality Over Quantity**: Focus on meaningful, well-structured questions

### Question Generation
1. **Balance Types**: Maintain proper distribution of question types
2. **Difficulty Progression**: Ensure logical difficulty progression
3. **WASSCE Alignment**: Follow exam patterns and standards
4. **Real-world Connection**: Include practical applications and examples

### Quality Assurance
1. **Regular Audits**: Run content audit weekly
2. **Peer Review**: Have content reviewed by subject matter experts
3. **Student Testing**: Test content with actual students
4. **Continuous Improvement**: Update templates based on feedback

## 🤝 Contributing

### Adding New Question Types
1. Update `unified-question-template.json`
2. Add patterns to `question-generator.js`
3. Update audit tool to recognize new types
4. Test with sample content

### Enhancing Templates
1. Modify template files
2. Update generation logic
3. Test with existing content
4. Document changes

### Reporting Issues
1. Check existing documentation
2. Review error messages carefully
3. Test with minimal content
4. Provide specific error details

## 📞 Support

### Documentation
- This README file
- Template files with examples
- Implementation plan with timelines

### Tools
- Content audit for problem identification
- Question generator for content creation
- Templates for consistency

### Next Steps
- Review generated content
- Apply to existing modules
- Test in application
- Iterate based on feedback

---

## 🎉 Ready to Enhance Your Content!

**Start with**: `node content-audit.js` to see current status
**Then**: `node question-generator.js` to generate new content
**Finally**: Apply generated content to your modules

**Estimated Time to Full Enhancement**: 6 weeks
**Current Progress**: 15% complete (Day 1 of 42 days)

---

*For questions or issues, refer to the implementation plan and gap analysis report.*
