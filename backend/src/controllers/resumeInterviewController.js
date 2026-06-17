const fs = require("fs");
const path = require("path");
const multer = require("multer");
const CandidateProfile = require("../models/CandidateProfile");
const InterviewSession = require("../models/InterviewSession");
const Question = require("../models/Question");
const Resume = require("../models/Resume");
const Notification = require("../models/Notification");
const { logAuditEvent } = require("../services/auditService");
const {
  buildResumeMatchAnalysis,
  buildResumeQuestions,
  extractTextFromFile,
  parseResumeText
} = require("../services/resumeService");

const uploadDir = path.join(process.cwd(), "uploads", "resumes");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `${req.user._id}-${Date.now()}${extension}`);
  }
});

const allowedMimeTypes = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
]);

const uploadResume = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      return cb(new Error("Only PDF and DOCX resume files are supported."));
    }

    return cb(null, true);
  }
}).single("resume");

const startResumeInterview = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Resume file is required" });
    }

    console.log(
      "[resumeInterview] Processing upload: %s (%s, %d bytes)",
      req.file.originalname,
      req.file.mimetype,
      req.file.size
    );

    let text;
    try {
      text = await extractTextFromFile(req.file);
    } catch (extractionError) {
      console.error(
        "[resumeInterview] Text extraction failed for %s: %s",
        req.file.originalname,
        extractionError.message
      );
      return res.status(422).json({
        success: false,
        message: `Failed to extract text from resume: ${extractionError.message}`
      });
    }

    const parsed = parseResumeText(text);
    const matchAnalysis = buildResumeMatchAnalysis({ parsed });

    const resume = await Resume.create({
      user: req.user._id,
      originalName: req.file.originalname,
      fileName: req.file.filename,
      filePath: req.file.path,
      mimeType: req.file.mimetype,
      size: req.file.size,
      text,
      parsed
    });

    await CandidateProfile.findOneAndUpdate(
      { user: req.user._id },
      {
        user: req.user._id,
        targetRole: req.body.role || "Resume Based Interview",
        experienceLevel: req.body.experienceLevel || "fresher",
        preferredInterviewTypes: ["resume"],
        skills: parsed.skills
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const questionCount = Math.min(Number(req.body.questionCount) || 8, 12);
    const session = await InterviewSession.create({
      user: req.user._id,
      resume: resume._id,
      source: "resume",
      role: req.body.role || "Resume Based Interview",
      experienceLevel: req.body.experienceLevel || "fresher",
      interviewType: "technical",
      durationMinutes: Number(req.body.durationMinutes) || 30,
      questionCount,
      status: "in_progress",
      resumeSnapshot: {
        ...parsed,
        matchAnalysis
      }
    });

    const payloads = buildResumeQuestions({ resume, questionCount });
    const questions = await Question.insertMany(payloads.map((question) => ({
      ...question,
      session: session._id
    })));

    session.questions = questions.map((question) => question._id);
    await session.save();

    await Notification.create({
      user: req.user._id,
      title: "Resume interview ready",
      message: `Generated ${questions.length} questions from ${req.file.originalname}.`,
      type: "success"
    });
    await logAuditEvent({ req, action: "resumeInterview.start", entityType: "InterviewSession", entityId: session._id, metadata: { resumeId: resume._id } });

    return res.status(201).json({
      success: true,
      resume,
      session: { ...session.toObject(), questions },
      resumeMatchAnalysis: matchAnalysis
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  uploadResume,
  startResumeInterview
};
