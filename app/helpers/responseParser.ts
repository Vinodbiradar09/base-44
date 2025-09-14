export interface ParsedGeminiResponse {
    optimizedCode : string,
    issuesAndFixes: string;
    performanceMetrics: string;
    scalingArchitecture: string;
    implementationRoadmap: string;
    productionDeployment: string;
    fullResponse: string;
}


export function geminiParserResponse (response : string) : ParsedGeminiResponse{
    try {
        const cleanResponse = response.trim();
        const sections = {
            optimizedCode: '# 🚀 OPTIMIZED CODE',
            issuesAndFixes: '# 🔍 CRITICAL ISSUES IDENTIFIED & RESOLVED', 
            performanceMetrics: '# 📊 PERFORMANCE METRICS',
            scalingArchitecture: '# 🏗️ SCALING ARCHITECTURE & INTEGRATION',
            implementationRoadmap: '# 🎯 IMPLEMENTATION ROADMAP',
            productionDeployment: '# 💡 PRODUCTION DEPLOYMENT CHECKLIST'
        };

    function extractSection(startHeader: string, endHeader?: string): string {
      const startIndex = cleanResponse.indexOf(startHeader);
      if (startIndex === -1) return '';
      
      let endIndex: number;
      if (endHeader) {
        endIndex = cleanResponse.indexOf(endHeader, startIndex + startHeader.length);
        if (endIndex === -1) endIndex = cleanResponse.length;
      } else {
        endIndex = cleanResponse.length;
      }
      
      return cleanResponse
        .substring(startIndex + startHeader.length, endIndex)
        .trim();
    }
    const optimizedCode = extractSection(
      sections.optimizedCode, 
      sections.issuesAndFixes
    );

    const issuesAndFixes = extractSection(
      sections.issuesAndFixes,
      sections.performanceMetrics
    );

    const performanceMetrics = extractSection(
      sections.performanceMetrics,
      sections.scalingArchitecture
    );

    const scalingArchitecture = extractSection(
      sections.scalingArchitecture,
      sections.implementationRoadmap
    );

    const implementationRoadmap = extractSection(
      sections.implementationRoadmap,
      sections.productionDeployment
    );

    const productionDeployment = extractSection(
      sections.productionDeployment
    );

     return {
      optimizedCode,
      issuesAndFixes,
      performanceMetrics,
      scalingArchitecture,
      implementationRoadmap,
      productionDeployment,
      fullResponse: cleanResponse
    };

    } catch (error) {
        console.error('Error parsing Gemini response:', error);
        return {
            optimizedCode: '',
            issuesAndFixes: '',
            performanceMetrics: '',
            scalingArchitecture: '',
            implementationRoadmap: '',
            productionDeployment: '',
            fullResponse: response
        };
    }
}