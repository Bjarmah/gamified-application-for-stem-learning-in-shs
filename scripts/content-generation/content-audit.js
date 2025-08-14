#!/usr/bin/env node

/**
 * Content Audit Script for STEM Learning Application
 * Analyzes all modules to identify gaps and inconsistencies
 */

const fs = require('fs');
const path = require('path');

// Configuration
const SUBJECTS = ['biology', 'chemistry', 'physics', 'mathematics', 'ict'];
const CONTENT_DIR = path.join(__dirname, '../../src/content');

// Audit Results
const auditResults = {
    timestamp: new Date().toISOString(),
    summary: {},
    subjects: {},
    recommendations: []
};

/**
 * Analyze a single lesson for completeness
 */
function analyzeLesson(lesson, lessonIndex, moduleTitle) {
    const analysis = {
        lessonId: lesson.id || `lesson-${lessonIndex}`,
        title: lesson.title || 'Untitled',
        hasText: !!lesson.text,
        textLength: lesson.text ? lesson.text.length : 0,
        knowledgeChecks: {},
        scenarioChallenges: [],
        ghanaContext: false,
        issues: []
    };

    // Analyze knowledge checks
    if (lesson.knowledgeChecks) {
        const kc = lesson.knowledgeChecks;
        analysis.knowledgeChecks = {
            mcq: kc.mcq ? kc.mcq.length : 0,
            trueFalse: kc.trueFalse ? kc.trueFalse.length : 0,
            fillInTheBlank: kc.fillInTheBlank ? kc.fillInTheBlank.length : 0,
            shortAnswer: kc.shortAnswer ? kc.shortAnswer.length : 0,
            problemSolving: kc.problemSolving ? kc.problemSolving.length : 0,
            graphInterpretation: kc.graphInterpretation ? kc.graphInterpretation.length : 0,
            workedExamples: kc.workedExamples ? kc.workedExamples.length : 0,
            calculationExercises: kc.calculationExercises ? kc.calculationExercises.length : 0,
            forceDiagram: kc.forceDiagram ? kc.forceDiagram.length : 0,
            matching: kc.matching ? kc.matching.length : 0
        };
    } else {
        analysis.knowledgeChecks = { mcq: 0, trueFalse: 0, fillInTheBlank: 0, shortAnswer: 0, problemSolving: 0 };
        analysis.issues.push('No knowledge checks found');
    }

    // Check for scenario challenges
    if (lesson.scenarioChallenges) {
        analysis.scenarioChallenges = lesson.scenarioChallenges.length;
    }

    // Check Ghana context
    if (lesson.text && lesson.text.toLowerCase().includes('ghana')) {
        analysis.ghanaContext = true;
    }

    // Identify issues
    const totalQuestions = Object.values(analysis.knowledgeChecks).reduce((sum, count) => sum + count, 0);
    if (totalQuestions < 5) {
        analysis.issues.push(`Insufficient questions: only ${totalQuestions} found (recommended: 15-20)`);
    }

    if (!analysis.ghanaContext) {
        analysis.issues.push('Missing Ghana context examples');
    }

    if (analysis.textLength < 500) {
        analysis.issues.push(`Content too short: ${analysis.textLength} characters (recommended: 1000+)`);
    }

    return analysis;
}

/**
 * Analyze a single module
 */
function analyzeModule(modulePath, subject) {
    try {
        const moduleData = JSON.parse(fs.readFileSync(modulePath, 'utf8'));
        const analysis = {
            moduleId: moduleData.moduleId || moduleData.id || 'unknown',
            moduleTitle: moduleData.moduleTitle || moduleData.title || 'Untitled',
            subject: subject,
            level: moduleData.level || 'Unknown',
            lessons: [],
            totalLessons: 0,
            totalQuestions: 0,
            hasGhanaContext: false,
            hasFinalAssessment: false,
            issues: []
        };

        // Analyze lessons
        if (moduleData.lessons && Array.isArray(moduleData.lessons)) {
            analysis.totalLessons = moduleData.lessons.length;
            analysis.lessons = moduleData.lessons.map((lesson, index) =>
                analyzeLesson(lesson, index, analysis.moduleTitle)
            );

            // Calculate totals
            analysis.totalQuestions = analysis.lessons.reduce((sum, lesson) =>
                sum + Object.values(lesson.knowledgeChecks).reduce((qSum, qCount) => qSum + qCount, 0), 0
            );

            // Check Ghana context
            analysis.hasGhanaContext = analysis.lessons.some(lesson => lesson.ghanaContext);

            // Check for final assessment
            analysis.hasFinalAssessment = !!moduleData.finalAssessment;
        } else {
            analysis.issues.push('No lessons found or lessons not in expected format');
        }

        // Check module-level issues
        if (!moduleData.objectives || moduleData.objectives.length < 3) {
            analysis.issues.push('Insufficient learning objectives (recommended: 3-5)');
        }

        if (!moduleData.alignment || !moduleData.alignment.exam) {
            analysis.issues.push('Missing WASSCE alignment information');
        }

        if (!moduleData.xpRules) {
            analysis.issues.push('Missing gamification rules');
        }

        return analysis;
    } catch (error) {
        return {
            moduleId: path.basename(modulePath, '.json'),
            moduleTitle: 'Error reading module',
            subject: subject,
            issues: [`Error reading module: ${error.message}`]
        };
    }
}

/**
 * Generate recommendations based on audit results
 */
function generateRecommendations(auditResults) {
    const recommendations = [];

    // Overall recommendations
    recommendations.push({
        priority: 'high',
        category: 'content',
        recommendation: 'Standardize lesson structure across all subjects using the new template',
        action: 'Apply standardized-lesson-template.json to all modules'
    });

    // Subject-specific recommendations
    Object.entries(auditResults.subjects).forEach(([subject, data]) => {
        const avgQuestionsPerLesson = data.totalQuestions / Math.max(data.totalLessons, 1);

        if (avgQuestionsPerLesson < 10) {
            recommendations.push({
                priority: 'high',
                category: 'assessment',
                subject: subject,
                recommendation: `Increase questions per lesson from ${avgQuestionsPerLesson.toFixed(1)} to 15-20`,
                action: `Add ${Math.ceil(15 - avgQuestionsPerLesson)} questions per lesson in ${subject}`
            });
        }

        if (!data.hasGhanaContext) {
            recommendations.push({
                priority: 'medium',
                category: 'context',
                subject: subject,
                recommendation: 'Add Ghana-specific examples and context',
                action: `Review and enhance Ghana context in ${subject} modules`
            });
        }
    });

    // Question type recommendations
    recommendations.push({
        priority: 'medium',
        category: 'assessment',
        recommendation: 'Diversify question types beyond MCQ and True/False',
        action: 'Add fill-in-the-blank, short answer, and problem-solving questions'
    });

    recommendations.push({
        priority: 'medium',
        category: 'gamification',
        recommendation: 'Ensure consistent XP and achievement systems',
        action: 'Standardize gamification elements across all modules'
    });

    return recommendations;
}

/**
 * Main audit function
 */
function runAudit() {
    console.log('🔍 Starting Content Audit...\n');

    let totalModules = 0;
    let totalLessons = 0;
    let totalQuestions = 0;

    SUBJECTS.forEach(subject => {
        const subjectDir = path.join(CONTENT_DIR, subject);
        const subjectAnalysis = {
            modules: [],
            totalModules: 0,
            totalLessons: 0,
            totalQuestions: 0,
            hasGhanaContext: false,
            hasFinalAssessment: false
        };

        if (fs.existsSync(subjectDir)) {
            const files = fs.readdirSync(subjectDir).filter(file => file.endsWith('.json'));

            files.forEach(file => {
                if (file !== 'index.ts') {
                    const modulePath = path.join(subjectDir, file);
                    const moduleAnalysis = analyzeModule(modulePath, subject);
                    subjectAnalysis.modules.push(moduleAnalysis);
                    totalModules++;
                    totalLessons += moduleAnalysis.totalLessons || 0;
                    totalQuestions += moduleAnalysis.totalQuestions || 0;
                }
            });

            subjectAnalysis.totalModules = subjectAnalysis.modules.length;
            subjectAnalysis.totalLessons = subjectAnalysis.modules.reduce((sum, mod) => sum + (mod.totalLessons || 0), 0);
            subjectAnalysis.totalQuestions = subjectAnalysis.modules.reduce((sum, mod) => sum + (mod.totalQuestions || 0), 0);
            subjectAnalysis.hasGhanaContext = subjectAnalysis.modules.some(mod => mod.hasGhanaContext);
            subjectAnalysis.hasFinalAssessment = subjectAnalysis.modules.some(mod => mod.hasFinalAssessment);

            auditResults.subjects[subject] = subjectAnalysis;
        }
    });

    // Generate summary
    auditResults.summary = {
        totalSubjects: SUBJECTS.length,
        totalModules,
        totalLessons,
        totalQuestions,
        averageQuestionsPerLesson: totalLessons > 0 ? (totalQuestions / totalLessons).toFixed(1) : 0
    };

    // Generate recommendations
    auditResults.recommendations = generateRecommendations(auditResults);

    return auditResults;
}

/**
 * Print audit results
 */
function printResults(results) {
    console.log('📊 AUDIT RESULTS SUMMARY\n');
    console.log(`📅 Audit Date: ${new Date(results.timestamp).toLocaleString()}`);
    console.log(`📚 Total Subjects: ${results.summary.totalSubjects}`);
    console.log(`📖 Total Modules: ${results.summary.totalModules}`);
    console.log(`📝 Total Lessons: ${results.summary.totalLessons}`);
    console.log(`❓ Total Questions: ${results.summary.totalQuestions}`);
    console.log(`📊 Avg Questions/Lesson: ${results.summary.averageQuestionsPerLesson}\n`);

    console.log('📋 SUBJECT-BY-SUBJECT ANALYSIS\n');
    Object.entries(results.subjects).forEach(([subject, data]) => {
        console.log(`🔬 ${subject.toUpperCase()}:`);
        console.log(`   Modules: ${data.totalModules}`);
        console.log(`   Lessons: ${data.totalLessons}`);
        console.log(`   Questions: ${data.totalQuestions}`);
        console.log(`   Ghana Context: ${data.hasGhanaContext ? '✅' : '❌'}`);
        console.log(`   Final Assessment: ${data.hasFinalAssessment ? '✅' : '❌'}`);

        if (data.modules.length > 0) {
            const avgQuestions = data.totalLessons > 0 ? (data.totalQuestions / data.totalLessons).toFixed(1) : 0;
            console.log(`   Avg Questions/Lesson: ${avgQuestions}`);
        }
        console.log('');
    });

    console.log('🚨 CRITICAL ISSUES IDENTIFIED\n');
    let criticalCount = 0;
    Object.entries(results.subjects).forEach(([subject, data]) => {
        data.modules.forEach(module => {
            if (module.issues && module.issues.length > 0) {
                console.log(`⚠️  ${subject.toUpperCase()} - ${module.moduleTitle}:`);
                module.issues.forEach(issue => {
                    console.log(`   • ${issue}`);
                    criticalCount++;
                });
                console.log('');
            }
        });
    });

    if (criticalCount === 0) {
        console.log('✅ No critical issues found!');
    }

    console.log('💡 RECOMMENDATIONS\n');
    results.recommendations.forEach((rec, index) => {
        const priorityIcon = rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🟢';
        console.log(`${priorityIcon} ${rec.recommendation}`);
        if (rec.subject) {
            console.log(`   Subject: ${rec.subject}`);
        }
        console.log(`   Action: ${rec.action}\n`);
    });
}

/**
 * Save audit results to file
 */
function saveResults(results) {
    const outputPath = path.join(__dirname, 'audit-results.json');
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`💾 Audit results saved to: ${outputPath}`);
}

// Run the audit
if (require.main === module) {
    try {
        const results = runAudit();
        printResults(results);
        saveResults(results);

        console.log('\n🎯 NEXT STEPS:');
        console.log('1. Review the standardized lesson template');
        console.log('2. Address critical issues identified above');
        console.log('3. Use content generation scripts to fill gaps');
        console.log('4. Apply standardized structure to all modules');

    } catch (error) {
        console.error('❌ Audit failed:', error.message);
        process.exit(1);
    }
}

module.exports = { runAudit, analyzeModule, analyzeLesson };
