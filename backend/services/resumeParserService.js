import axios from "axios";
import { logger } from "../utils/logger.js";

class ResumeParserService {
  constructor() {
    // This service can integrate with external resume parsing APIs
    // For now, we'll implement basic text extraction
  }

  async parseResumeText(text) {
    try {
      // Basic text parsing - in a real implementation, you'd use a proper NLP library
      const lines = text.split("\n").filter((line) => line.trim());

      const parsedData = {
        fullName: this.extractName(lines),
        email: this.extractEmail(text),
        phone: this.extractPhone(text),
        education: this.extractEducation(lines),
        experience: this.extractExperience(lines),
        skills: this.extractSkills(text),
        summary: this.extractSummary(lines),
      };

      logger.info("Resume text parsed successfully");
      return parsedData;
    } catch (error) {
      logger.error("Resume parsing error:", error);
      return this.getDefaultParsedData();
    }
  }

  async parseResumeFromFile(fileBuffer, fileName) {
    try {
      // For PDF files, you would use a PDF parsing library
      // For DOCX files, you would use a DOCX parsing library
      // This is a simplified implementation

      let text = "";

      if (fileName.endsWith(".pdf")) {
        text = await this.parsePDF(fileBuffer);
      } else if (fileName.endsWith(".docx")) {
        text = await this.parseDOCX(fileBuffer);
      } else {
        text = fileBuffer.toString("utf-8");
      }

      return await this.parseResumeText(text);
    } catch (error) {
      logger.error("File resume parsing error:", error);
      return this.getDefaultParsedData();
    }
  }

  // Extraction methods
  extractName(lines) {
    // Simple heuristic: first non-empty line that looks like a name
    for (const line of lines.slice(0, 5)) {
      const cleanLine = line.trim();
      if (cleanLine && /^[A-Z][a-z]+ [A-Z][a-z]+/.test(cleanLine)) {
        return cleanLine;
      }
    }
    return "";
  }

  extractEmail(text) {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const match = text.match(emailRegex);
    return match ? match[0] : "";
  }

  extractPhone(text) {
    const phoneRegex =
      /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
    const match = text.match(phoneRegex);
    return match ? match[0] : "";
  }

  extractEducation(lines) {
    const education = [];
    const educationKeywords = [
      "university",
      "college",
      "institute",
      "bachelor",
      "master",
      "phd",
      "degree",
    ];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      if (educationKeywords.some((keyword) => line.includes(keyword))) {
        education.push({
          institution: lines[i],
          // In a real implementation, you'd extract more details
          degree: this.extractDegree(lines[i]),
          period: this.extractPeriod(lines, i),
        });
      }
    }

    return education;
  }

  extractExperience(lines) {
    const experience = [];
    const experienceKeywords = ["experience", "work", "employment", "career"];

    let inExperienceSection = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();

      if (experienceKeywords.some((keyword) => line.includes(keyword))) {
        inExperienceSection = true;
        continue;
      }

      if (inExperienceSection && this.looksLikeJobEntry(lines[i])) {
        experience.push({
          company: this.extractCompany(lines[i]),
          position: this.extractPosition(lines[i]),
          period: this.extractPeriod(lines, i),
          description: this.extractDescription(lines, i),
        });
      }
    }

    return experience;
  }

  extractSkills(text) {
    const commonSkills = [
      "javascript",
      "python",
      "java",
      "react",
      "node.js",
      "html",
      "css",
      "sql",
      "mongodb",
      "aws",
      "docker",
      "kubernetes",
      "git",
      "rest api",
      "machine learning",
      "data analysis",
      "project management",
      "agile",
    ];

    const skills = commonSkills.filter((skill) =>
      text.toLowerCase().includes(skill.toLowerCase())
    );

    return [
      {
        category: "Technical Skills",
        items: skills,
      },
    ];
  }

  extractSummary(lines) {
    // Take first few lines that aren't name/contact info as summary
    const summaryLines = lines.slice(0, 3).filter((line) => {
      const cleanLine = line.toLowerCase().trim();
      return !this.isContactInfo(cleanLine) && !this.isName(cleanLine);
    });

    return summaryLines.join(" ");
  }

  // Helper methods
  looksLikeJobEntry(line) {
    // Simple heuristic for job entries
    return (
      line.includes(" at ") ||
      (line.split(" ").length <= 8 && /[A-Z]/.test(line))
    );
  }

  extractCompany(line) {
    const atIndex = line.indexOf(" at ");
    if (atIndex !== -1) {
      return line.substring(atIndex + 4).trim();
    }
    return line;
  }

  extractPosition(line) {
    const atIndex = line.indexOf(" at ");
    if (atIndex !== -1) {
      return line.substring(0, atIndex).trim();
    }
    return line;
  }

  extractDegree(line) {
    // Simple degree extraction
    if (line.toLowerCase().includes("bachelor")) return "Bachelor's Degree";
    if (line.toLowerCase().includes("master")) return "Master's Degree";
    if (line.toLowerCase().includes("phd")) return "PhD";
    return "Degree";
  }

  extractPeriod(lines, index) {
    // Look for date patterns in surrounding lines
    for (
      let i = Math.max(0, index - 2);
      i < Math.min(lines.length, index + 3);
      i++
    ) {
      const dateMatch = lines[i].match(
        /(\d{4}[-/]\d{1,2}[-/]\d{1,2}|\d{1,2}[-/]\d{1,2}[-/]\d{4}|\w+ \d{4})/
      );
      if (dateMatch) {
        return dateMatch[0];
      }
    }
    return "";
  }

  extractDescription(lines, index) {
    // Take next 2-3 lines as description
    const descriptionLines = [];
    for (let i = index + 1; i < Math.min(lines.length, index + 4); i++) {
      if (lines[i].trim() && !this.looksLikeJobEntry(lines[i])) {
        descriptionLines.push(lines[i].trim());
      }
    }
    return descriptionLines.join(" ");
  }

  isContactInfo(line) {
    return (
      line.includes("@") ||
      /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(line) ||
      line.includes("linkedin") ||
      line.includes("github")
    );
  }

  isName(line) {
    return /^[A-Z][a-z]+ [A-Z][a-z]+/.test(line);
  }

  // Placeholder methods for file parsing
  async parsePDF(buffer) {
    // In a real implementation, use a PDF parsing library like pdf-parse
    logger.info("PDF parsing would be implemented here");
    return "PDF content would be extracted here";
  }

  async parseDOCX(buffer) {
    // In a real implementation, use a DOCX parsing library
    logger.info("DOCX parsing would be implemented here");
    return "DOCX content would be extracted here";
  }

  getDefaultParsedData() {
    return {
      fullName: "",
      email: "",
      phone: "",
      education: [],
      experience: [],
      skills: [],
      summary: "",
    };
  }
}

export const resumeParserService = new ResumeParserService();
export default resumeParserService;
