import axios from "axios";
import { logger } from "../utils/logger.js";
import { getRedisClient, connectRedis } from "../config/redis.js";

class MLService {
  constructor() {
    this.baseURL = process.env.ML_SERVICE_URL;
    this.apiKey = process.env.ML_API_KEY;
    this.apiKey = process.env.ML_API_KEY;
  }

  async getRedis() {
    const redisClient = getRedisClient();
    return redisClient;
  }


  async makeMLRequest(endpoint, data) {
    try {
      const response = await axios.post(`${this.baseURL}${endpoint}`, data, {
        headers: {
          "X-API-Key": this.apiKey,
          "Content-Type": "application/json",
        },
        timeout: 30000, // 30 seconds timeout
      });

      return response.data;
    } catch (error) {
      logger.error(`ML Service request failed for ${endpoint}:`, error);
      throw new Error(`ML Service unavailable: ${error.message}`);
    }
  }

  async analyzeResume(resumeUrl) {
    try {
      // Check cache first
      const cacheKey = `resume_analysis:${Buffer.from(resumeUrl).toString(
        "base64"
      )}`;
      const cached = await this.redisClient.get(cacheKey);

      if (cached) {
        logger.info("Returning cached resume analysis");
        return JSON.parse(cached);
      }

      const analysis = await this.makeMLRequest("/ml/resume/feedback", {
        resume_url: resumeUrl,
      });

      // Cache result for 24 hours
      await this.redisClient.setEx(cacheKey, 86400, JSON.stringify(analysis));

      return analysis;
    } catch (error) {
      logger.error("Resume analysis failed:", error);
      // Return fallback analysis
      return this.getFallbackResumeAnalysis();
    }
  }

  async analyzeJobMatch(resumeId, jobData) {
    try {
      const cacheKey = `job_match:${resumeId}:${Buffer.from(
        JSON.stringify(jobData)
      ).toString("base64")}`;
      const cached = await this.redisClient.get(cacheKey);

      if (cached) {
        logger.info("Returning cached job match analysis");
        return JSON.parse(cached);
      }

      const analysis = await this.makeMLRequest("/ml/match", {
        resume_id: resumeId,
        job_description: jobData.description,
        job_title: jobData.title,
        company: jobData.company,
      });

      // Cache result for 12 hours
      await this.redisClient.setEx(cacheKey, 43200, JSON.stringify(analysis));

      return analysis;
    } catch (error) {
      logger.error("Job match analysis failed:", error);
      // Return fallback analysis
      return this.getFallbackJobMatchAnalysis(jobData);
    }
  }

  async getJobRecommendations(resumeId, jobPool = []) {
    try {
      const analysis = await this.makeMLRequest("/ml/recommend", {
        resume_id: resumeId,
        job_pool: jobPool,
      });

      return analysis;
    } catch (error) {
      logger.error("Job recommendations failed:", error);
      return {
        recommendations: jobPool.slice(0, 5).map((job) => ({
          job,
          match_score: Math.random() * 0.3 + 0.5, // Random score between 0.5-0.8
          reason: "Fallback recommendation",
        })),
      };
    }
  }

  async predictInterviewSuccess(jobData, candidateData) {
    try {
      const analysis = await this.makeMLRequest("/ml/interview", {
        job: jobData,
        candidate: candidateData,
      });

      return analysis;
    } catch (error) {
      logger.error("Interview prediction failed:", error);
      return {
        probability: 0.6,
        factors: [
          "Experience level matches requirements",
          "Skills alignment is good",
          "Education background is relevant",
        ],
        suggestions: [
          "Prepare for technical questions",
          "Research the company culture",
          "Practice behavioral interviews",
        ],
      };
    }
  }

  async checkATSCompatibility(resumeUrl) {
    try {
      const analysis = await this.makeMLRequest("/ml/ats", {
        resume_url: resumeUrl,
      });

      return analysis;
    } catch (error) {
      logger.error("ATS compatibility check failed:", error);
      return {
        ats_score: 0.7,
        issues: [
          "Formatting could be improved for ATS",
          "Consider adding more keywords",
          "Ensure clear section headings",
        ],
        suggestions: [
          "Use standard section names",
          "Include relevant keywords",
          "Avoid graphics and tables",
        ],
      };
    }
  }

  // Fallback methods when ML service is unavailable
  getFallbackResumeAnalysis() {
    return {
      overall_score: 0.75,
      feedback: [
        {
          section: "structure",
          score: 0.8,
          comments: ["Well-organized sections", "Clear formatting"],
          suggestions: ["Add more quantifiable achievements"],
        },
        {
          section: "skills",
          score: 0.7,
          comments: ["Good technical skills listed"],
          suggestions: [
            "Add proficiency levels",
            "Include recent technologies",
          ],
        },
      ],
      keywords: ["JavaScript", "React", "Node.js", "Python"],
      improvement_areas: ["Add more metrics", "Include project details"],
    };
  }

  getFallbackJobMatchAnalysis(jobData) {
    const baseScore = 0.6 + Math.random() * 0.3; // Random score between 0.6-0.9

    return {
      match_score: baseScore,
      similarity_score: baseScore - 0.1,
      skill_match: baseScore - 0.05,
      top_skills_matched: ["JavaScript", "React", "Node.js"],
      missing_skills: ["AWS", "Docker"],
      model_version: "fallback-v1",
    };
  }
}

export const mlService = new MLService();
export default mlService;
